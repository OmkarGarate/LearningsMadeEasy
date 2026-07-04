import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  loginWithCode,
  refreshAccessToken,
  logout,
  getMe,
} from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const codeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/code', codeLimiter, loginWithCode);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.get('/me', authRequired, getMe);

export default router;
