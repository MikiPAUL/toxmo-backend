import { Router } from 'express'
import { signIn, signOut, verifyOTP } from '../controllers/authentication'
import *  as products from '../controllers/product'
import { applyToSell, createUser, profile, editProfile } from '../controllers/user'
import * as seller from '../controllers/seller'
import * as categories from '../controllers/category'
import * as orders from '../controllers/order'
import * as relationships from '../controllers/relationship'
import * as team from '../controllers/team'
import * as admin from '../controllers/admin/index'
import * as upload from '../controllers/upload'
import * as bit from '../controllers/bit'
import * as waitList from '../controllers/webapp/waitList'
import * as assetLink from '../controllers/webapp/assetLink'
import { authUser, authAdmin } from '../middlewares/auth.middleware'
import uploadImageService from '../services/aws-s3'
// import * as teamMember from '../controllers/teamMember'
import * as liveStream from '../controllers/liveStream'
import * as reviews from '../controllers/review'

const router = Router();

router.post('/api/auth/signin', signIn)
router.post('/api/auth/verifyotp', verifyOTP)

router.post('/api/users', createUser)
router.post('/api/user/profile', authUser, profile)
router.put('/api/user/:id', authUser, editProfile)
router.delete('/api/user', authUser, signOut)
router.post('/api/seller', authUser, applyToSell)
router.get('/api/seller/:id/details', authUser, seller.shopDetails)
router.get('/api/seller/:id/orders', authUser, seller.shopOrders)
router.get('/api/seller/:id/reviews', authUser, seller.shopReviews)
router.get('/api/seller/:id/live', authUser, seller.shopLive)
router.patch('/api/seller/:id', authUser, seller.update)
router.get('/api/me', authUser, profile)

router.post('/api/user/follow', authUser, relationships.followUser)
router.get('/api/user/:id/relationship', authUser, relationships.relationshipInfo)

router.get('/api/products', authUser, products.index)
router.get('/api/products/:id', authUser, products.show)
router.put('/api/products/:id', authUser, products.update)
router.post('/api/products', authUser, products.create)
router.get('/api/products/:id/reviews', authUser, products.reviews);

router.post('/api/reviews', authUser, reviews.create)

router.get('/api/category', authUser, categories.index)
router.post('/api/category', authUser, categories.create)

router.get('/api/orders', authUser, orders.index)
router.post('/api/orders', authUser, orders.create)
// router.get('/api/orders/:id', authUser, orders.show)
router.delete('/api/orders/:id', authUser, orders.destroy)
router.put('/api/orders/:id', authUser, orders.update)

router.post('/api/team', authUser, team.createTeam)
router.get('/api/team', authUser, team.existingTeamList)
router.get('/api/team/:id', authUser, team.showTeam)

// router.patch('/api/team/:id', authUser, teamMember.addTeamMember)

router.post('/api/livestream', authUser, liveStream.create)
router.patch('/api/livestream/:id', authUser, liveStream.edit)
router.get('/api/livestream', authUser, liveStream.index)

router.post('/api/upload/video', authUser, uploadImageService.single('video'), upload.uploadVideo)

router.post('/api/bits', authUser, bit.create)
router.get('/api/bits', authUser, bit.index)
router.get('/api/bits/:id', authUser, bit.show)
router.delete('/api/bits/:id', authUser, bit.destroy)
router.patch('/api/bits/:id/toggleLike', authUser, bit.toggleLike)
router.put('/api/bits', bit.update)
router.post('/api/uploadImage/:id', authUser, uploadImageService.single('image'), upload.uploadImage)

//admin
router.post('/admin/api/auth/login', admin.auth.signIn)

router.get('/admin/api/orders', authAdmin, admin.orders.index)
router.patch('/admin/api/orders/:id', authAdmin, admin.orders.update)

router.get('/admin/api/sellers', authAdmin, admin.seller.index)
router.put('/admin/api/sellers/:id', authAdmin, admin.seller.update)

//webapp
router.post('/api/waitList', waitList.create)
router.get('/admin/api/waitList', authAdmin, waitList.index)

router.get('/.well-known/assetlinks.json', assetLink.index)

export default router
