import User from '../models/User.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

// Convert a Mongoose Map (or plain object/null) to a plain object
function mapToObj(m) {
  if (!m) return {};
  if (m instanceof Map || typeof m.entries === 'function') {
    try { return Object.fromEntries(m.entries()); } catch { return {}; }
  }
  if (typeof m === 'object') {
    try { return Object.fromEntries(Object.entries(m)); } catch { return {}; }
  }
  return {};
}

function publicUser(user) {
  const mcqOuter = mapToObj(user.mcqAnswers);
  const mcqAnswers = {};
  for (const [conceptId, innerMap] of Object.entries(mcqOuter)) {
    mcqAnswers[conceptId] = mapToObj(innerMap);
  }
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    progress: mapToObj(user.progress),
    notes: mapToObj(user.notes),
    streak: user.streak,
    lastStudyDate: user.lastStudyDate,
    xp: user.xp,
    earnedBadges: user.earnedBadges || [],
    mcqAnswers,
    solvedProblems: user.solvedProblems || [],
    chatMessages: user.chatMessages || 0,
    preferences: user.preferences || { dailyReminderTime: '19:00' },
  };
}

const USERNAME = 'Omkar';

// POST /api/auth/code  { code: "secret123" }
export async function loginWithCode(req, res) {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    const expected = process.env.LOGIN_CODE || 'secret123';
    if (code !== expected) {
      return res.status(401).json({ error: 'Wrong code' });
    }

    const pseudoEmail = `${USERNAME.toLowerCase()}@local`;

    let user = await User.findOne({ email: pseudoEmail });
    if (!user) {
      user = await User.create({ email: pseudoEmail, name: USERNAME });
    } else if (!user.name) {
      user.name = USERNAME;
    }
    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user._id);
    const { token: refreshToken } = signRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('loginWithCode error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

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
