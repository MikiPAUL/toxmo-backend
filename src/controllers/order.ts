import { Request, Response } from 'express'
import currentUser from '../lib/utils/getCurrentUser'
import { orderParams } from '../lib/validations/order'
import prisma from '../models/order'
import { OrderStatus } from "@prisma/client"
import { IOrderDetails } from 'order';

const serializeOrder = (order: IOrderDetails) => {
    const { team, ...orderDetail } = order
    return {
        ...orderDetail
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req)
        if (!user) return res.status(401).json({ error: "Unable to find the user" })

        const orderRequest = orderParams.safeParse(req.body)
        if (!orderRequest.success) {
            return res.status(422).json({ error: "Unable to create order" })
        }
        const { sellerId, totalPrice, products, cartOrder } = orderRequest.data.order;

        if (cartOrder) {
            const order = await prisma.$transaction(async (tx) => {
                // delete the cart
                await tx.cart.deleteMany({
                    where: {
                        userId: req.userId,
                        product: {
                            sellerId
                        }
                    }
                })
                return tx.order.create({
                    data: {
                        totalPrice,
                        orderStatus: OrderStatus.orderConfirmed,
                        sellerId,
                        userId: req.userId,
                        OrderItem: {
                            create: products
                        }
                    },
                    select: {
                        totalPrice: true, orderStatus: true, createdAt: true,
                        OrderItem: {
                            select: {
                                Product: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                })
            })
            return res.json({ order })
        }
        const order = await prisma.order.create({
            data: {
                totalPrice,
                orderStatus: OrderStatus.orderConfirmed,
                sellerId,
                userId: req.userId,
                OrderItem: {
                    create: products
                }
            }
        })
        res.json({ order })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to create order' })
    }
}

const index = async (req: Request, res: Response) => {
    try {
        const orderStatus = req.query.OrderStatus as string

    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to create order' })
    }
}

const update = async (req: Request, res: Response) => {
    try {

    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to update order' })
    }
}

// const show = async (req: Request, res: Response) => {
//     const user = await currentUser(req)
//     if (!user) return res.status(422).json({ error: "Unable to find the user" })
//     const order_id = parseInt(req.params.id);
//     const order = await prisma.order.find_by(order_id)

//     if (!order) return res.status(422).json({ error: "Unable to find the order" })
//     res.json({ order: order })
// }

const destroy = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const order = await prisma.order.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                createdAt: true
            }
        })
        if (!order) throw new Error('Not found')
        const timeNow = new Date()
        const timeDifference = (timeNow.getTime() - order.createdAt.getTime()) / 1000
        if (timeDifference > 180) throw new Error('Order cannot be cancelled')
        await prisma.order.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.sendStatus(204)
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to cancel order' })
    }
}

export {
    create,
    index,
    // show,
    destroy,
    update
}