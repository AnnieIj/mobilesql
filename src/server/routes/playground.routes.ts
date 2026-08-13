import { Router } from 'express';
import { PlaygroundController } from '../controllers/playgroundController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);
router.get('/saved', PlaygroundController.getSavedQueries);
router.post('/saved', PlaygroundController.saveQuery);
router.delete('/saved/:id', PlaygroundController.deleteSavedQuery);
router.get('/history', PlaygroundController.getQueryHistory);
router.post('/history', PlaygroundController.logExecution);

export default router;
