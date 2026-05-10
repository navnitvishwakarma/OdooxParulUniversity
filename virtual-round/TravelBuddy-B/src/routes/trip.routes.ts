import { Router } from 'express';
import { getTrips, createTrip, getTripById, updateTrip, deleteTrip, getPublicTrips, joinTrip } from '../controllers/trip.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// All trip routes require authentication
router.use(requireAuth);

router.get('/', getTrips);
router.get('/explore', getPublicTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/join', joinTrip);

// Stop routes (nested under trips)
import { getStops, addStop, updateStop, deleteStop, reorderStops } from '../controllers/trip.controller';

router.get('/:id/stops', getStops);
router.post('/:id/stops', addStop);
router.put('/:id/stops/:stopId', updateStop);
router.delete('/:id/stops/:stopId', deleteStop);
router.post('/:id/stops/reorder', reorderStops);

// Nested routes for Budget and Checklist
import budgetRoutes from './budget.routes';
import checklistRoutes from './checklist.routes';

router.use('/:id/budget', budgetRoutes);
router.use('/:id/checklist', checklistRoutes);

export default router;
