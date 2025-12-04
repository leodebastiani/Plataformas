import { Router } from 'express';
import { getPlatforms, createPlatform, updatePlatform, deletePlatform, exportPlatforms } from '../controllers/platform.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', getPlatforms);
router.get('/export', authorize(['ADMIN']), exportPlatforms);
router.post('/', authorize(['ADMIN']), createPlatform);
router.put('/:id', authorize(['ADMIN']), updatePlatform);
router.delete('/:id', authorize(['ADMIN']), deletePlatform);

export default router;
