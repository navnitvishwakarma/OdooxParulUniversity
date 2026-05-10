import { Router } from 'express';
import { suggestItinerary } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Protect AI routes with authentication
router.post('/suggest', requireAuth, suggestItinerary);

export default router;
