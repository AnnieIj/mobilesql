import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);
router.get('/dashboards', AnalyticsController.getDashboards);
router.get('/dashboards/:id', AnalyticsController.getDashboardById);
router.post('/dashboards', AnalyticsController.createDashboard);
router.put('/dashboards/:id', AnalyticsController.updateDashboard);
router.delete('/dashboards/:id', AnalyticsController.deleteDashboard);

export default router;
