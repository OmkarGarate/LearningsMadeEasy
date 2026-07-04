import { Router } from 'express';
import { aiChat } from '../controllers/aiController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.post('/chat', authRequired, aiChat);

export default router;
