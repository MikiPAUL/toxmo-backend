import { Router } from 'express';
import { signIn, verifyOTP } from '../controllers/authentication';
import { createUser } from '../controllers/user';
const router = Router();

router.post('/api/auth/signin', signIn)
router.post('/api/auth/verifyotp', verifyOTP)
router.post('/api/users', createUser)

export default router
