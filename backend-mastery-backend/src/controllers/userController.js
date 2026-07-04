import User from '../models/User.js';

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
    reminders: user.reminders || [],
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

function today() {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(a, b) {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

// ── Progress ────────────────────────────────────────────────────
export async function toggleConcept(req, res) {
  try {
    const { conceptId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const wasComplete = user.progress.get(conceptId) != null;
    if (wasComplete) {
      user.progress.delete(conceptId);
      user.xp = Math.max(0, user.xp - 10);
    } else {
      user.progress.set(conceptId, Date.now());
      user.xp += 10;
      const t = today();
      if (user.lastStudyDate !== t) {
        if (user.lastStudyDate && diffDays(user.lastStudyDate, t) === 1) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }
        user.lastStudyDate = t;
      }
    }
    await user.save();
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error('toggleConcept error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
}

// ── MCQ answers ──────────────────────────────────────────────────
export async function recordMcqAnswer(req, res) {
  try {
    const { conceptId, mcqId, selected, correct } = req.body;
    if (!conceptId || !mcqId) {
      return res.status(400).json({ error: 'conceptId and mcqId required' });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Init nested map if needed
    if (!user.mcqAnswers) user.mcqAnswers = new Map();
    if (!user.mcqAnswers.get(conceptId)) user.mcqAnswers.set(conceptId, new Map());

    const conceptMap = user.mcqAnswers.get(conceptId);
    if (selected === null || correct === null) {
      conceptMap.delete(mcqId);
    } else {
      conceptMap.set(mcqId, { selected, correct });
    }

    // Recalculate total correct + award XP for newly correct
    let totalCorrect = 0;
    let newCorrectCount = 0;
    for (const [, answers] of user.mcqAnswers) {
      for (const [, ans] of answers) {
        if (ans?.correct) {
          totalCorrect++;
          if (ans.mcqId === mcqId && correct) newCorrectCount++;
        }
      }
    }
    if (correct) user.xp = (user.xp || 0) + 5;
    await user.save();
    res.json({ mcqAnswers: publicUser(user).mcqAnswers, quizCorrect: totalCorrect, xp: user.xp });
  } catch (err) {
    console.error('recordMcqAnswer error:', err);
    res.status(500).json({ error: 'Failed to record answer' });
  }
}

// ── Notes ────────────────────────────────────────────────────────
export async function setNote(req, res) {
  try {
    const { conceptId } = req.params;
    const { text } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (text && text.trim()) {
      user.notes.set(conceptId, text);
    } else {
      user.notes.delete(conceptId);
    }
    await user.save();
    res.json({ notes: mapToObj(user.notes) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
}


export async function setPreferences(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.preferences = { ...user.preferences.toObject?.() || user.preferences, ...req.body };
    await user.save();
    res.json({ preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save preferences' });
  }
}

export async function syncBadges(req, res) {
  try {
    const { badges } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.earnedBadges = Array.from(new Set([...(user.earnedBadges || []), ...(badges || [])]));
    await user.save();
    res.json({ earnedBadges: user.earnedBadges });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync badges' });
  }
}

export async function recordProblemSolved(req, res) {
  try {
    const { conceptId, problemTitle } = req.body;
    if (!conceptId || !problemTitle) {
      return res.status(400).json({ error: 'conceptId and problemTitle required' });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const key = `${conceptId}::${problemTitle}`;
    if (!user.solvedProblems.includes(key)) {
      user.solvedProblems.push(key);
      user.xp = (user.xp || 0) + 20;
    }
    await user.save();
    res.json({ solvedProblems: user.solvedProblems, xp: user.xp });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record problem' });
  }
}
