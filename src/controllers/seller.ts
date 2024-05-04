import prisma from "../models/seller";
import relationshipPrisma from "../models/relationship";
import { Request, Response } from "express";

const shopReviews = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string
        const reviews = await prisma.seller.shopReviews(parseInt(userId));

        res.status(200).json({ reviews })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop reviews' })

    }
}

const shopDetails = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const shopDetails = await prisma.seller.sellerInfo(parseInt(id));
        const outOfStocks = await prisma.seller.outOfStockQuantity(parseInt(id))
        const isFollowing = await relationshipPrisma.relationship.alreadyFollowing(req.userId, parseInt(id))

        res.json({ seller: { ...shopDetails, outOfStocks: outOfStocks?.products, isFollowing } })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop details' })
    }
}

const shopOrders = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.id;
        const orderStatus = req.query.status as string;

        if (orderStatus === 'orderConfirmed' || orderStatus === 'productDelivered') {
            const orders = await prisma.order.findMany({
                where: {
                    Product: {
                        sellerId: parseInt(userId)
                    },
                    orderStatus
                },
                include: {
                    Product: {
                        select: {
                            id: true, imageLink: true, name: true, description: true
                        }
                    },
                    user: {
                        select: {
                            username: true, phoneNumber: true, address: {
                                select: {
                                    address1: true, address2: true, city: true, country: true, pincode: true, state: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            // const totalOrders = orderProducts.reduce((total, product) => {
            //     return product._count.orders + total
            // }, 0)
            return res.json({ orders })
        }
        throw new Error('Invalid order status')
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop orders' })
    }
}

const shopLive = async (req: Request, res: Response) => {
    try {
        const sellerId = req.params.id as string

        const liveStream = await prisma.liveStream.findFirst({
            where: {
                sellerId: parseInt(sellerId),
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        res.status(200).json({ liveStream })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop orders' })
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const status = req.query.status as string
        console.log(status === 'open')
        const shopStatus = await prisma.seller.update({
            where: {
                id: req.userId
            },
            data: {
                shopOpen: (status === 'open')
            },
            select: {
                shopOpen: true
            }
        })
        res.json({ shopStatus })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop orders' })
    }
}

export {
    shopReviews,
    shopDetails,
    shopOrders,
    shopLive,
    update
}