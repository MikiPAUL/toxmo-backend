import { Request, Response } from 'express'
import prisma from '../models/cart'
import { addItemParams, updateQuantityParams } from '../lib/validations/cart';

const addItem = async (req: Request, res: Response) => {
    try {
        const createParams = addItemParams.safeParse(req.body)
        if (!createParams.success) {
            return res.status(422).json({ error: "Invalid params" })
        }

        const { productId } = createParams.data.cart
        const present = await prisma.cart.checkProductAlreadyInCart(req.userId, productId)
        if (present) throw new Error('Item already present in the cart')

        await prisma.cart.addItem(req.userId, productId)
        res.status(201).json({
            success: true,
            message: 'Item added successfully'
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to add item to the cart' })
    }
}

const removeItem = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id as string
        const present = await prisma.cart.checkProductAlreadyInCart(req.userId, parseInt(productId))
        if (!present) throw new Error('Item not present in the cart')

        await prisma.cart.removeItem(req.userId, parseInt(productId))
        res.status(200).json({
            success: true,
            message: 'Item removed successfully'
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to remove item from the cart' })
    }
}

const cartItems = async (req: Request, res: Response) => {
    try {
        const sellerId = req.query.sellerId as string
        const itemDetails = await prisma.cart.cartDetails(req.userId, parseInt(sellerId))

        await prisma.deliveryOption.findFirst({
            where: {
                sellerId: parseInt(sellerId)
            },
            orderBy: {
                deliveryRadius: 'asc'
            }
        })

        res.json({
            cart: {
                itemDetails
            }
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to list products' })
    }
}

const changeQuantity = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id as string
        const present = await prisma.cart.checkProductAlreadyInCart(req.userId, parseInt(productId))
        if (!present) throw new Error('Item not present in the cart')


        const updateParams = updateQuantityParams.safeParse(req.body)
        if (!updateParams.success) {
            return res.status(422).json({ error: "Invalid params" })
        }

        const { quantity } = updateParams.data.cart
        const detail = await prisma.cart.changeQuantity(req.userId, parseInt(productId), quantity)

        res.json({
            cart: {
                detail
            }
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to increase stock quantity' })
    }
}

const cartList = async (req: Request, res: Response) => {
    try {
        const shopList = await prisma.cart.cartShopList(req.userId)
        res.json({
            cart: {
                shopList
            }
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to list shops' })
    }
}

export {
    addItem,
    removeItem,
    cartItems,
    changeQuantity,
    cartList
}