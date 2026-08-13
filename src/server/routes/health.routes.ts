import { Router, Request, Response } from 'express';
import { ApiResponseBuilder } from '../utils/apiResponse';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const memory = process.memoryUsage();

  return ApiResponseBuilder.success(
    res,
    {
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      systemMetrics: {
        rssBytes: memory.rss,
        heapTotalBytes: memory.heapTotal,
        heapUsedBytes: memory.heapUsed,
      },
    },
    'MobileSQL Production Backend Health check OK.'
  );
});

export default router;
