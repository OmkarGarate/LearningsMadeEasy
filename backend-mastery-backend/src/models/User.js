import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Passkey user — we still need a unique identifier
    // Using a random username for now, but in real apps you'd use email
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    displayName: { type: String, default: '' },

    // Stored passkeys (for multi-device support)
    credentials: [{
      credentialID: { type: String, required: true, unique: true },
      credentialPublicKey: { type: String, required: true }, // base64
      counter: { type: Number, default: 0 },
      transports: [{ type: String }],
      deviceName: { type: String, default: 'Unknown device' },
      createdAt: { type: Date, default: Date.now },
    }],

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
      done: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    }],
    streak: { type: Number, default: 0 },
    lastStudyDate: { type: String, default: null },
    xp: { type: Number, default: 0 },
    earnedBadges: { type: [String], default: [] },
    preferences: {
      dailyReminderTime: { type: String, default: '19:00' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
