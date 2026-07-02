import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    challenge: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['register', 'login'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index — MongoDB will auto-delete documents when expiresAt is reached
// IMPORTANT: `expires` value in the index should be 0 (delete when expiresAt equals Date.now())
challengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Challenge', challengeSchema);
