import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, exportUsers } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', authorize(['ADMIN']), getUsers);
router.get('/export', authorize(['ADMIN']), exportUsers);
router.post('/', authorize(['ADMIN']), createUser);
router.put('/:id', authorize(['ADMIN']), updateUser);
router.delete('/:id', authorize(['ADMIN']), deleteUser);

export default router;
