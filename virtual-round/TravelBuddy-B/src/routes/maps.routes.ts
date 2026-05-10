import { Router } from 'express';
import { getNearby } from '../controllers/maps.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/nearby', requireAuth, getNearby);

export default router;
