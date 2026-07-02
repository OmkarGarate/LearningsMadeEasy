import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  toggleConcept,
  setNote,
  addReminder,
  toggleReminder,
  deleteReminder,
  setPreferences,
  syncBadges,
} from '../controllers/userController.js';

const router = Router();
router.use(authRequired);

router.post('/progress/:conceptId/toggle', toggleConcept);
router.put('/notes/:conceptId', setNote);

router.post('/reminders', addReminder);
router.patch('/reminders/:id/toggle', toggleReminder);
router.delete('/reminders/:id', deleteReminder);

router.put('/preferences', setPreferences);
router.post('/badges/sync', syncBadges);

export default router;
