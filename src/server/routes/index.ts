import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import academyRoutes from './academy.routes';
import playgroundRoutes from './playground.routes';
import analyticsRoutes from './analytics.routes';
import datasetRoutes from './dataset.routes';
import portfolioRoutes from './portfolio.routes';
import notificationRoutes from './notification.routes';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/academy', academyRoutes);
apiRouter.use('/playground', playgroundRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/datasets', datasetRoutes);
apiRouter.use('/portfolio', portfolioRoutes);
apiRouter.use('/notifications', notificationRoutes);

export default apiRouter;
