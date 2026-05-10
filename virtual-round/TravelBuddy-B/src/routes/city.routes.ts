import { Router } from 'express';
import { searchCities, getCityById } from '../controllers/city.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Using requireAuth if you want these protected, or make them public.
// Assuming we want users to be logged in to search destinations.
router.use(requireAuth);

router.get('/', searchCities);
router.get('/:id', getCityById);

export default router;
