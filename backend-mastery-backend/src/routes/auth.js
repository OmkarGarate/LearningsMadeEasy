import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  startRegistration,
  finishRegistration,
  startLogin,
  finishLogin,
  refreshAccessToken,
  logout,
  getMe,
  listCredentials,
  deleteCredential,
} from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration
router.post('/register/start', authLimiter, startRegistration);
router.post('/register/finish', authLimiter, finishRegistration);

// Login
router.post('/login/start', authLimiter, startLogin);
router.post('/login/finish', authLimiter, finishLogin);

// Session
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.get('/me', authRequired, getMe);

// Credentials
router.get('/credentials', authRequired, listCredentials);
router.delete('/credentials/:id', authRequired, deleteCredential);

export default router;
