import { Router } from 'express';
import { getBudgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem } from '../controllers/budget.controller';
import { requireAuth } from '../middlewares/auth.middleware';

// mergeParams: true is necessary to access :id from parent router
const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', getBudgetItems);
router.post('/', addBudgetItem);
router.put('/:itemId', updateBudgetItem);
router.delete('/:itemId', deleteBudgetItem);

export default router;
