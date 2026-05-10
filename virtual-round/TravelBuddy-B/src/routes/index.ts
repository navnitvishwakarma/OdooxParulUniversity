import { Router } from 'express';

const router = Router();

// Sample Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TravelBuddy API is running' });
});

import userRoutes from './user.routes';
import tripRoutes from './trip.routes';
import cityRoutes from './city.routes';
import activityRoutes from './activity.routes';
import stopActivityRoutes from './stopActivity.routes';
import aiRoutes from './ai.routes';
import mapsRoutes from './maps.routes';

router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/cities', cityRoutes);
router.use('/activities', activityRoutes);
router.use('/stops/:stopId/activities', stopActivityRoutes);
router.use('/ai', aiRoutes);
router.use('/maps', mapsRoutes);

export default router;
