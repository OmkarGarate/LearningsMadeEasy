import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

connectDB();

app.use(helmet({
  // Passkeys need cross-origin isolation to work in some browsers
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS — allow your Vercel frontend
app.use(cors({
  origin: FRONTEND_URL.split(',').map(u => u.trim()),
  credentials: true,
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to see challenges in DB
app.get('/api/debug/challenges', async (req, res) => {
  try {
    const Challenge = (await import('./models/Challenge.js')).default;
    const all = await Challenge.find().sort({ createdAt: -1 }).limit(10);
    res.json({ count: all.length, challenges: all });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to see users in DB
app.get('/api/debug/users', async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default;
    const users = await User.find({}, { credentials: 1, username: 1, displayName: 1 });
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEMPORARY: delete all users (for re-signup with fixed code)
app.delete('/api/debug/users', async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default;
    const result = await User.deleteMany({});
    const Challenge = (await import('./models/Challenge.js')).default;
    await Challenge.deleteMany({});
    res.json({ deleted: result.deletedCount, message: 'All users + challenges deleted. Sign up again.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Mastery API running on port ${PORT}`);
  console.log(`📡 CORS allowed origin: ${FRONTEND_URL}`);
  console.log(`🔑 WebAuthn RP_ID: ${process.env.RP_ID || 'localhost'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
