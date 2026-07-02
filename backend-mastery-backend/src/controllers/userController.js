import User from '../models/User.js';

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
    res.json({ notes: Object.fromEntries(user.notes) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
}

// ── Reminders ───────────────────────────────────────────────────
export async function addReminder(req, res) {
  try {
    const { text, datetime } = req.body;
    if (!text || !datetime) {
      return res.status(400).json({ error: 'text and datetime are required' });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.reminders.push({ text, datetime: new Date(datetime), done: false });
    await user.save();
    res.json({ reminders: user.reminders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reminder' });
  }
}

export async function toggleReminder(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const r = user.reminders.id(id);
    if (!r) return res.status(404).json({ error: 'Reminder not found' });
    r.done = !r.done;
    await user.save();
    res.json({ reminders: user.reminders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reminder' });
  }
}

export async function deleteReminder(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.reminders = user.reminders.filter(r => r._id.toString() !== id);
    await user.save();
    res.json({ reminders: user.reminders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete reminder' });
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
