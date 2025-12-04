import { Router } from 'express';
import { toggleAdminRole, getExpiringPlatforms } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));

router.patch('/users/:id/toggle-admin', toggleAdminRole);
router.get('/expiring-platforms', getExpiringPlatforms);

export default router;
