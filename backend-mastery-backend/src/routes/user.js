import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  toggleConcept,
  setNote,
  setPreferences,
  syncBadges,
  recordMcqAnswer,
  recordProblemSolved,
} from '../controllers/userController.js';

const router = Router();
router.use(authRequired);

router.post('/progress/:conceptId/toggle', toggleConcept);
router.post('/mcq/answer', recordMcqAnswer);
router.post('/problem/solved', recordProblemSolved);
router.put('/notes/:conceptId', setNote);
router.put('/preferences', setPreferences);
router.post('/badges/sync', syncBadges);

export default router;
