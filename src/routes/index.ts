import { Router } from 'express'
import { signIn, verifyOTP } from '../controllers/authentication'
import *  as products from '../controllers/product'
import { applyToSell, createUser, profile } from '../controllers/user'
import * as categories from '../controllers/category'
import * as orders from '../controllers/order'
import * as team from '../controllers/team'
import { authUser } from '../middlewares/auth.middleware'
import uploadImage from '../services/uploadImage'
import * as teamMember from '../controllers/teamMember'

const router = Router();

router.post('/api/auth/signin', signIn)
router.post('/api/auth/verifyotp', verifyOTP)


router.post('/api/users', createUser)
router.post('/api/user/profile', profile)
router.post('/api/seller', applyToSell)

router.get('/api/products', authUser, products.index)
router.get('/api/products/:id', authUser, products.show)
router.post('/api/products', authUser, products.create)
router.post('/api/products/:id/uploadImage', authUser, uploadImage.single('image'), products.uploadImage);

router.get('/api/category', authUser, categories.index)
router.post('/api/category', authUser, categories.create)

router.get('/api/orders', authUser, orders.index)
router.post('/api/orders', authUser, orders.create)
router.get('/api/orders/:id', authUser, orders.show)
router.delete('/api/orders/:id', authUser, orders.destroy)
router.put('/api/orders/:id', authUser, orders.update)

router.post('/api/team', authUser, team.createTeam)
router.get('/api/team', authUser, team.existingTeamList)
router.get('/api/team/:id', authUser, team.showTeam)

router.patch('/api/team/:id', authUser, teamMember.addTeamMember)

export default router
