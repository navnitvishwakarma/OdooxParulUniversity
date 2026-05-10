import { Router } from 'express';
import { getChecklistItems, addChecklistItem, updateChecklistItem, deleteChecklistItem } from '../controllers/checklist.controller';
import { requireAuth } from '../middlewares/auth.middleware';

// mergeParams: true is necessary to access :id from parent router
const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', getChecklistItems);
router.post('/', addChecklistItem);
router.put('/:itemId', updateChecklistItem);
router.delete('/:itemId', deleteChecklistItem);

export default router;
