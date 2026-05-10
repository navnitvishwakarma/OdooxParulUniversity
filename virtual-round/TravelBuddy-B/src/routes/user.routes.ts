import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
