import { Router } from 'express';
import { getStopActivities, addStopActivity, deleteStopActivity } from '../controllers/stopActivity.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Note: Mounted as /stops/:stopId/activities
router.get('/', getStopActivities);
router.post('/', addStopActivity);
router.delete('/:id', deleteStopActivity);

export default router;
