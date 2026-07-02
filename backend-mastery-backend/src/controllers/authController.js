import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

const RP_NAME = 'Backend Mastery';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    displayName: user.displayName,
    progress: Object.fromEntries(user.progress || {}),
    notes: Object.fromEntries(user.notes || {}),
    reminders: user.reminders || [],
    streak: user.streak,
    lastStudyDate: user.lastStudyDate,
    xp: user.xp,
    earnedBadges: user.earnedBadges || [],
    preferences: user.preferences || { dailyReminderTime: '19:00' },
    credentials: (user.credentials || []).map(c => ({
      id: c.credentialID,
      deviceName: c.deviceName,
      createdAt: c.createdAt,
    })),
  };
}

function toBase64url(buffer) {
  return Buffer.from(buffer).toString('base64url');
}

function fromBase64url(str) {
  return new Uint8Array(Buffer.from(str, 'base64url'));
}

// Helper: create a consistent user handle for a username
function userHandleFor(username) {
  // Hash the username to get a stable 16-byte handle
  // This way the same user always has the same handle across devices
  const hash = Buffer.alloc(16);
  const input = username.toLowerCase();
  for (let i = 0; i < input.length; i++) {
    hash[i % 16] ^= input.charCodeAt(i);
  }
  return new Uint8Array(hash);
}

// ════════════════════════════════════════════════════════════════
// REGISTRATION
// ════════════════════════════════════════════════════════════════

export async function startRegistration(req, res) {
  try {
    const { username, displayName } = req.body;
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing && existing.credentials.length > 0) {
      return res.status(400).json({ error: 'Username already taken. Try a different one or sign in.' });
    }

    // User ID MUST be Uint8Array in @simplewebauthn/server v13+
    // Use a stable hash of the username as the user handle
    const userID = userHandleFor(username);

    // Generate a random challenge to pass in
    const inputChallenge = toBase64url(crypto.getRandomValues(new Uint8Array(32)));

    // Save challenge for verification (use the one we'll get back from generateRegistrationOptions)
    // First, generate options to get the actual challenge that will be used
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID,
      userName: username.toLowerCase(),
      userDisplayName: displayName || username,
      challenge: inputChallenge,
      timeout: 60_000,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    // CRITICAL: simplewebauthn v13 may transform the challenge.
    // Store the FINAL challenge from options (not what we generated).
    await Challenge.create({
      challenge: options.challenge,
      userId: existing?._id || new mongoose.Types.ObjectId(),
      type: 'register',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log(`✅ Stored challenge: "${options.challenge.slice(0, 30)}..."`);

    res.json({
      options,
      isNewUser: !existing,
    });
  } catch (err) {
    console.error('startRegistration error:', err);
    res.status(500).json({ error: 'Failed to start registration: ' + err.message });
  }
}

export async function finishRegistration(req, res) {
  try {
    const { username, displayName, credential, challenge: clientChallenge } = req.body;
    if (!username || !credential || !clientChallenge) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`🔍 finishRegistration: looking for challenge "${clientChallenge.slice(0, 20)}..."`);

    // Normalize the challenge (sometimes base64 vs base64url differences)
    const normalized = clientChallenge.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    // Try multiple lookup strategies
    let challengeDoc = await Challenge.findOne({ challenge: normalized, type: 'register' });
    if (!challengeDoc) {
      challengeDoc = await Challenge.findOne({ challenge: clientChallenge, type: 'register' });
    }
    if (!challengeDoc) {
      // Last resort: find ANY register challenge for this user that isn't expired
      const allChallenges = await Challenge.find({ type: 'register' }).sort({ createdAt: -1 }).limit(5);
      console.log(`❌ Challenge not found. Tried: "${normalized.slice(0, 20)}..." and "${clientChallenge.slice(0, 20)}..."`);
      console.log(`   DB has ${allChallenges.length} register challenges:`);
      allChallenges.forEach(c => console.log(`     - "${c.challenge.slice(0, 30)}..." expires ${c.expiresAt.toISOString()}`));
      return res.status(400).json({ error: 'Challenge expired. Try again.' });
    }
    console.log(`✅ Challenge found, deleting...`);
    await Challenge.deleteOne({ _id: challengeDoc._id });

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: clientChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ error: 'Passkey verification failed' });
    }

    // v13 of @simplewebauthn/server restructures registrationInfo
    const reg = verification.registrationInfo;
    const credentialID = reg.credential?.id || reg.credentialID;
    const credentialPublicKey = reg.credential?.publicKey || reg.credentialPublicKey;
    const counter = reg.credential?.counter ?? reg.counter ?? 0;

    if (!credentialID || !credentialPublicKey) {
      console.error('❌ Missing credential data:', JSON.stringify(reg, null, 2));
      return res.status(400).json({ error: 'Passkey data incomplete' });
    }

    console.log(`✅ Passkey verified: ID=${typeof credentialID === 'string' ? credentialID.slice(0, 20) : 'bytes'}...`);

    // Detect device name from user agent
    const ua = req.headers['user-agent'] || '';
    let deviceName = 'Unknown device';
    if (/iPhone/.test(ua)) deviceName = 'iPhone';
    else if (/iPad/.test(ua)) deviceName = 'iPad';
    else if (/Mac OS/.test(ua)) deviceName = 'Mac';
    else if (/Android/.test(ua)) deviceName = 'Android';
    else if (/Windows/.test(ua)) deviceName = 'Windows PC';
    else if (/Linux/.test(ua)) deviceName = 'Linux';

    // Create or update user
    let user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      user = new User({
        username: username.toLowerCase(),
        displayName: displayName || username,
      });
    }

    // v13 of @simplewebauthn/server returns credential.id as a base64url STRING
    // (already encoded via isoBase64URL.fromBuffer). Don't re-encode.
    user.credentials.push({
      credentialID: credentialID,  // already a base64url string
      credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64url'),
      counter,
      transports: credential.response?.transports || [],
      deviceName,
    });
    await user.save();

    const accessToken = signAccessToken(user._id);
    const { token: refreshToken } = signRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('finishRegistration error:', err);
    res.status(500).json({ error: 'Failed to finish registration: ' + err.message });
  }
}

// ════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ════════════════════════════════════════════════════════════════

export async function startLogin(req, res) {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || user.credentials.length === 0) {
      return res.status(404).json({ error: 'No passkey found for this username. Sign up first.' });
    }

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: user.credentials.map(cred => {
        // Defensive: ensure id is a string
        const id = typeof cred.credentialID === 'string'
          ? cred.credentialID
          : toBase64url(cred.credentialID);
        return {
          id,
          transports: cred.transports || [],
        };
      }),
      userVerification: 'preferred',
      timeout: 60_000,
    });

    // Store the challenge from options (not generated by us)
    await Challenge.create({
      challenge: options.challenge,
      userId: user._id,
      type: 'login',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log(`✅ Login challenge stored: "${options.challenge.slice(0, 30)}..."`);

    res.json({ options });
  } catch (err) {
    console.error('startLogin error:', err);
    res.status(500).json({ error: 'Failed to start login: ' + err.message });
  }
}

export async function finishLogin(req, res) {
  try {
    const { credential, challenge: clientChallenge } = req.body;
    if (!credential || !clientChallenge) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const challengeDoc = await Challenge.findOne({ challenge: clientChallenge, type: 'login' });
    if (!challengeDoc) {
      return res.status(400).json({ error: 'Challenge expired. Try again.' });
    }
    const user = await User.findById(challengeDoc.userId);
    await Challenge.deleteOne({ _id: challengeDoc._id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // The browser sends rawId as a base64url string
    const credID = typeof credential.rawId === 'string'
      ? credential.rawId
      : toBase64url(credential.rawId);

    const userCred = user.credentials.find(c => c.credentialID === credID);
    if (!userCred) {
      console.log(`❌ Credential not found. Looking for: ${credID.slice(0, 30)}...`);
      console.log(`   Available: ${user.credentials.map(c => c.credentialID.slice(0, 30)).join(', ')}`);
      return res.status(400).json({ error: 'Passkey not recognized' });
    }

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: clientChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      // v13: these need to be Uint8Array
      credential: {
        id: userCred.credentialID,
        publicKey: fromBase64url(userCred.credentialPublicKey),
        counter: userCred.counter,
      },
      requireUserVerification: false,
    });

    if (!verification.verified) {
      return res.status(400).json({ error: 'Authentication failed' });
    }

    userCred.counter = verification.authenticationInfo.newCounter;
    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user._id);
    const { token: refreshToken } = signRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('finishLogin error:', err);
    res.status(500).json({ error: 'Failed to finish login: ' + err.message });
  }
}

// ════════════════════════════════════════════════════════════════
// Session helpers
// ════════════════════════════════════════════════════════════════

export async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    const accessToken = signAccessToken(user._id);
    const { token: newRefreshToken } = signRefreshToken(user._id);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Failed to refresh token' });
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await User.updateOne(
        { 'refreshTokens.token': refreshToken },
        { $pull: { refreshTokens: { token: refreshToken } } }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function listCredentials(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ credentials: publicUser(user).credentials });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list credentials' });
  }
}

export async function deleteCredential(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.credentials.length <= 1) {
      return res.status(400).json({ error: 'Cannot delete your only passkey' });
    }
    user.credentials = user.credentials.filter(c => c.credentialID !== id);
    await user.save();
    res.json({ credentials: publicUser(user).credentials });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete credential' });
  }
}
