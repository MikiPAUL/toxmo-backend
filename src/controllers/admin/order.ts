import { Request, Response } from 'express'
import prisma from '../../models/order'
import type { Order } from '@prisma/client'
import { OrderStatus } from "@prisma/client";

const index = async (req: Request, res: Response) => {
    try {
        const orderStatus = req.query.orderStatus as string
        let orders: Order[] | null

        if (orderStatus === OrderStatus.orderPlaced || orderStatus === OrderStatus.orderConfirmed ||
            orderStatus === OrderStatus.productDelivered || orderStatus === OrderStatus.productShipped) {
            orders = await prisma.order.findMany({
                where: {
                    orderStatus
                }
            })
        }
        else {
            orders = await prisma.order.findMany({})
        }

        res.status(200).json({ orders })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to list order' })
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id as string
        const orderStatus = req.query.orderStatus as string

        if (orderStatus !== OrderStatus.orderPlaced && orderStatus !== OrderStatus.orderConfirmed &&
            orderStatus !== OrderStatus.productDelivered && orderStatus !== OrderStatus.productShipped) {
            return res.status(422).json({ error: 'Invalid order status' })
        }

        const order = await prisma.order.updateOrderStatus({ orderId: parseInt(orderId), status: orderStatus })
        res.status(200).json({ order })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to update order' })
    }
}


export {
    index,
    update
}