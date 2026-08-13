import { Router } from 'express';
import { DatasetController } from '../controllers/datasetController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', DatasetController.getDatasets);
router.get('/:id', DatasetController.getDatasetById);
router.post('/', DatasetController.createDataset);
router.delete('/:id', DatasetController.deleteDataset);

export default router;
