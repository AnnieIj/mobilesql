import { Router } from 'express';
import { sqlController } from '../controllers/sqlController';
import { validateRequest } from '../middlewares/validate';
import {
  executeSqlSchema,
  explainSqlSchema,
  formatSqlSchema,
  validateSqlSchema,
  optimizeSqlSchema,
} from '../schemas/sql.schema';
import { optionalAuth } from '../middlewares/auth';

const router = Router();

// POST /api/v1/sql/execute - Execute SQL statement in sandbox
router.post(
  '/execute',
  optionalAuth,
  validateRequest(executeSqlSchema),
  sqlController.execute.bind(sqlController)
);

// POST /api/v1/sql/explain - Generate EXPLAIN query execution plan
router.post(
  '/explain',
  validateRequest(explainSqlSchema),
  sqlController.explain.bind(sqlController)
);

// POST /api/v1/sql/format - Format SQL code
router.post(
  '/format',
  validateRequest(formatSqlSchema),
  sqlController.format.bind(sqlController)
);

// POST /api/v1/sql/validate - Validate SQL syntax and safety
router.post(
  '/validate',
  validateRequest(validateSqlSchema),
  sqlController.validate.bind(sqlController)
);

// POST /api/v1/sql/optimize - Query performance recommendations
router.post(
  '/optimize',
  validateRequest(optimizeSqlSchema),
  sqlController.optimize.bind(sqlController)
);

export default router;
