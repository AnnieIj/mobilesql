import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolioController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);
router.get('/projects', PortfolioController.getProjects);
router.post('/projects', PortfolioController.createProject);
router.delete('/projects/:id', PortfolioController.deleteProject);
router.get('/certificates', PortfolioController.getCertificates);

export default router;
