import { Request, Response } from 'express'
import prisma from '../../models/order'
import type { Order } from '@prisma/client'
import { OrderStatus } from "@prisma/client";

const index = async (req: Request, res: Response) => {
    try {
        const orderStatus = req.query.orderStatus as string
        let orders

        if (orderStatus === OrderStatus.orderPlaced || orderStatus === OrderStatus.orderConfirmed ||
            orderStatus === OrderStatus.productDelivered || orderStatus === OrderStatus.productShipped) {
            orders = await prisma.seller.findMany({
                where: {
                    products: {
                        some: {
                            orders: {
                                some: {
                                    orderStatus
                                }
                            }
                        }
                    }
                },
                select: {
                    id: true, brandName: true, products: {
                        select: {
                            orders: {
                                where: {
                                    orderStatus
                                },
                                select: {
                                    id: true, createdAt: true, quantity: true, purchaseType: true, orderStatus: true, totalPrice: true,
                                    user: {
                                        select: {
                                            username: true, phoneNumber: true, address: true
                                        }
                                    },
                                    Product: {
                                        select: {
                                            name: true, imageLink: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
        else {
            orders = await prisma.seller.findMany({
                select: {
                    id: true, brandName: true, products: {
                        select: {
                            orders: {
                                select: {
                                    id: true, createdAt: true, quantity: true, purchaseType: true, orderStatus: true,
                                    user: {
                                        select: {
                                            username: true, phoneNumber: true, address: true
                                        }
                                    },
                                    Product: {
                                        select: {
                                            name: true, price: true, teamPrice: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }

        const modifiedOrders = orders.map((shopOrder) => {
            return {
                id: shopOrder.id,
                sellerStoreName: shopOrder.brandName,
                orders: shopOrder.products.flatMap(product => product.orders)
            }
        })

        res.status(200).json({ orders: modifiedOrders })
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