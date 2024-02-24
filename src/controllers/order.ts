import { Request, Response } from 'express'
import currentUser from '../lib/utils/getCurrentUser'
import { orderParams } from '../lib/validations/order'
import prisma from '../models/order'
import { TeamStatus, OrderStatus, PurchaseType } from "@prisma/client";
import teamMemberPrisma from '../models/TeamMember'
import productPrisma from '../models/product'
import teamPrisma from '../models/team'
import { IOrderDetails } from 'order';
import type { Review } from '@prisma/client'

const serializeOrder = (order: IOrderDetails) => {
    const { team, ...orderDetail } = order
    return {
        ...orderDetail,
        expireAt: team?.expireAt || null,
        teamMemberCount: team?._count.teamMembers || null
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
        const orderDetails = orderRequest.data.order;
        const { orderId } = await prisma.$transaction(async (prisma) => {
            const productStockQuantity = await prisma.product.findUnique({
                where: {
                    id: orderDetails.productId
                },
                select: {
                    stockQuantity: true
                }
            })
            if (!productStockQuantity || productStockQuantity.stockQuantity < orderDetails.quantity) throw new Error('Out of stock')
            const order = await prisma.order.add(user.id, orderDetails)
            await productPrisma.product.reduceStockQuantity(orderDetails.productId, orderDetails.quantity)
            const teamCount = await prisma.teamMember.count({
                where: {
                    teamId: orderDetails.teamId,
                    userId: req.userId
                }
            })
            const teamMemberCount = await prisma.teamMember.count({ where: { teamId: orderDetails.teamId } })
            if (teamCount === 1 && teamMemberCount > 1) throw new Error('Already joined this team!!!')
            if (orderDetails.teamId && teamCount == 0) {
                const team = await prisma.team.findUnique({
                    where: {
                        id: orderDetails.teamId
                    },
                    select: {
                        id: true,
                        Product: {
                            select: {
                                id: true,
                                teamSize: true
                            }
                        }
                    }
                });

                if (!team || !team.Product) throw new Error('Unable to join the team')
                await teamMemberPrisma.teamMember.addTeamMember(orderDetails.teamId, req.userId);

                const teamMemberCount = await teamPrisma.team.teamMembersCount(orderDetails.teamId);
                const maxTeamCapacity = team.Product.teamSize;

                if (teamMemberCount?._count.teamMembers === maxTeamCapacity) {
                    await teamPrisma.team.update({
                        where: {
                            id: team.id
                        },
                        data: {
                            teamStatus: TeamStatus.teamConfirmed
                        }
                    })
                    await prisma.order.updateOrderStatus({ teamId: team.id, status: OrderStatus.orderConfirmed })
                }
            }
            if (orderDetails.purchaseType === PurchaseType.individual) {
                await prisma.order.updateOrderStatus({ orderId: order.id, status: OrderStatus.orderConfirmed })
            }
            return { orderId: order.id }
        });
        const order = (await prisma.order.orderDetails([orderId])).at(0)
        if (!order) {
            return res.status(422).json({ error: "Unable to create order" })
        }
        res.status(201).json({ order: serializeOrder(order) })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to create order' })
    }
}

const index = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req)
        const orderStatus = req.query.orderStatus
        if (!user) return res.status(401).json({ error: "Unable to find the user" })
        const orderReviews: Map<number, boolean> = new Map()

        if (orderStatus === 'productDelivered') {
            const orderIds = (await prisma.order.findMany({
                where: {
                    userId: user.id,
                    orderStatus: OrderStatus.productDelivered
                },
                select: {
                    id: true, review: true
                },
                orderBy: {
                    id: 'desc'
                }
            })).flatMap(order => {
                orderReviews.set(order.id, order.review !== null)
                return order.id
            })
            const orders = await prisma.order.orderDetails(orderIds)
            return res.status(200).json({
                orders: orders.map(order => {
                    return { ...serializeOrder(order), hasReview: orderReviews.get(order.id) }
                })
            })
        }
        const orderIds = (await prisma.order.findMany({
            where: {
                userId: user.id,
                NOT: {
                    orderStatus: OrderStatus.productDelivered
                }
            },
            select: {
                id: true, review: true
            }
        })).flatMap(order => {
            orderReviews.set(order.id, order.review !== null)
            return order.id
        })
        const orders = await prisma.order.orderDetails(orderIds)

        res.status(200).json({
            orders: orders.map(order => {
                return { ...serializeOrder(order), hasReview: orderReviews.get(order.id) }
            })
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to create order' })
    }
}

const update = async (req: Request, res: Response) => {
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })

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
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })


}

export {
    create,
    index,
    // show,
    destroy,
    update
}