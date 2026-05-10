import { Router } from 'express';
import { searchActivities } from '../controllers/activity.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', searchActivities);

export default router;
