import { Router } from 'express';
import { getSectors, createSector, updateSector, deleteSector } from '../controllers/sector.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', getSectors);
router.post('/', authorize(['ADMIN']), createSector);
router.put('/:id', authorize(['ADMIN']), updateSector);
router.delete('/:id', authorize(['ADMIN']), deleteSector);

export default router;
