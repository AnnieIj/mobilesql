import { Router } from 'express';
import { AcademyController } from '../controllers/academyController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);
router.get('/progress', AcademyController.getProgress);
router.post('/complete', AcademyController.completeLesson);

export default router;
