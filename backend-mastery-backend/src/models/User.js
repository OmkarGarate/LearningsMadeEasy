import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, default: '' },
    refreshTokens: [{
      token: String,
      createdAt: { type: Date, default: Date.now, expires: 7 * 24 * 60 * 60 }
    }],
    lastLoginAt: { type: Date, default: Date.now },
    progress: { type: Map, of: Number, default: {} },
    notes: { type: Map, of: String, default: {} },
    reminders: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      text: { type: String, required: true },
      datetime: { type: Date, required: true },
      category: { type: String, default: 'general' },
      recurring: { type: String, enum: ['none', 'daily', 'weekly'], default: 'none' },
      done: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    }],
    streak: { type: Number, default: 0 },
    lastStudyDate: { type: String, default: null },
    xp: { type: Number, default: 0 },
    earnedBadges: { type: [String], default: [] },
    mcqAnswers: { type: Map, of: Map, default: {} },     // { conceptId: { mcqId: { selected, correct } }
    solvedProblems: { type: [String], default: [] },     // ["conceptId::problemTitle", ...]
    chatMessages: { type: Number, default: 0 },          // total messages sent to AI tutor
    preferences: {
      dailyReminderTime: { type: String, default: '19:00' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
