import { Router } from 'express';
import { searchCities, getCityById, createCity } from '../controllers/city.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', searchCities);
router.post('/', createCity);
router.get('/:id', getCityById);

export default router;
