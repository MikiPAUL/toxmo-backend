import { Router } from 'express'
import { signIn, verifyOTP } from '../controllers/authentication'
import *  as products from '../controllers/product'
import { createUser, profile } from '../controllers/user'
import * as categories from '../controllers/category'
import * as orders from '../controllers/order'
import { authUser } from '../middlewares/auth.middleware'
const router = Router();

router.post('/api/auth/signin', signIn)
router.post('/api/auth/verifyotp', verifyOTP)


router.post('/api/users', createUser)
router.post('/api/user/profile', profile)

router.get('/api/products', authUser, products.index)
router.get('/api/products/:id', authUser, products.show)
router.post('/api/products', products.create)

router.get('/api/category', authUser, categories.index)
router.post('/api/category', authUser, categories.create)

router.get('/api/orders', authUser, orders.index)
router.post('/api/orders', authUser, orders.create)
router.get('/api/orders/:id', authUser, orders.show)
router.delete('/api/orders/:id', authUser, orders.destroy)
router.put('/api/orders/:id', authUser, orders.update)

export default router
