import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import aiRouter from './routes/ai.js';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

connectDB();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(cors({
  origin: FRONTEND_URL.split(',').map(u => u.trim()),
  credentials: true,
}));

app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.AI_API_KEY;
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    ai: {
      enabled: hasKey,
      baseURL: process.env.AI_BASE_URL || '(default: https://api.openai.com/v1)',
      model: process.env.AI_MODEL || '(default: gpt-4o-mini)',
      keyPrefix: hasKey ? process.env.AI_API_KEY.slice(0, 7) + '…' : '(not set)',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, name: 1, xp: 1, streak: 1, earnedBadges: 1 });
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/debug/users', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ deleted: result.deletedCount, message: 'All users deleted. Sign in again.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Mastery API running on port ${PORT}`);
  console.log(`📡 CORS allowed origin: ${FRONTEND_URL}`);
  console.log(`🤖 AI tutor: ${process.env.AI_API_KEY ? '✅ enabled (' + (process.env.AI_MODEL || 'gpt-4o-mini') + ')' : '⚠️  fallback mode (set AI_API_KEY in .env)'}`);
  console.log(`🔑 Login code: ${process.env.LOGIN_CODE ? 'set' : 'using default (secret123)'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
