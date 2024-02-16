import { Request, Response } from 'express'
import currentUser from '../lib/utils/getCurrentUser'
import { orderParams } from '../lib/validations/order'
import prisma from '../models/order'
import { TeamStatus, OrderStatus } from "@prisma/client";
import teamMemberPrisma from '../models/TeamMember'
import productPrisma from '../models/product'
import teamPrisma from '../models/team'

const create = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req)
        if (!user) return res.status(401).json({ error: "Unable to find the user" })

        const orderRequest = orderParams.safeParse(req.body)
        if (!orderRequest.success) {
            return res.status(422).json({ error: "Unable to create order" })
        }
        const orderDetails = orderRequest.data.order;
        const { order } = await prisma.$transaction(async (prisma) => {
            const productStockQuantity = await prisma.product.findUnique({
                where: {
                    id: orderDetails.productId
                },
                select: {
                    stockQuantity: true
                }
            })
            if (!productStockQuantity || productStockQuantity.stockQuantity <= 0) throw new Error('Out of stock')
            const order = await prisma.order.add(user.id, orderDetails)
            const teamCount = await prisma.teamMember.count({
                where: {
                    teamId: orderDetails.teamId,
                    userId: req.userId
                }
            })
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
                    await prisma.order.updateOrderStatus({ teamId: team.id, status: OrderStatus.productShipped })
                }
            }
            else if (!orderDetails.teamId) {
                await prisma.order.updateOrderStatus({ orderId: order.id, status: OrderStatus.productShipped })
            }
            if (order.orderStatus == OrderStatus.orderPlaced) {
                await productPrisma.product.reduceStockQuantity(orderDetails.productId, orderDetails.quantity)
            }
            return { order }
        });
        if (!order) {
            return res.status(422).json({ error: "Unable to create order" })
        }

        const teamMembersCount = await teamPrisma.team.teamMembersCount(orderDetails.teamId || -1)
        res.status(201).json({ order: { ...order, teamMemberCount: teamMembersCount?._count.teamMembers || null } })
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

        if (orderStatus === 'productDelivered') {
            const orders = await prisma.order.findMany({
                where: {
                    userId: user.id,
                    orderStatus: OrderStatus.productDelivered
                },
                include: {
                    Product: {
                        select: {
                            id: true, description: true, imageLink: true, name: true, teamSize: true
                        }
                    }
                }
            })
            return res.status(200).json({ orders })
        }
        const orders = await prisma.order.findMany({
            where: {
                userId: user.id,
                NOT: {
                    orderStatus: OrderStatus.productDelivered
                }
            },
            include: {
                Product: {
                    select: {
                        id: true, description: true, imageLink: true, name: true, teamSize: true
                    }
                }
            }
        })
        const response = orders.map(async (order) => {
            const teamMembersCount = await teamPrisma.team.teamMembersCount(order.teamId || -1)
            return { ...order, teamMemberCount: teamMembersCount?._count.teamMembers || null }
        })

        res.status(200).json({ orders: await Promise.all(response) })
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

const show = async (req: Request, res: Response) => {
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })
    const order_id = parseInt(req.params.id);
    const order = await prisma.order.find_by(order_id)

    if (!order) return res.status(422).json({ error: "Unable to find the order" })
    res.json({ order: order })
}

const destroy = async (req: Request, res: Response) => {
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })


}

export {
    create,
    index,
    show,
    destroy,
    update
}

//if purchase Type is team
// create team entry
//list customers -> /join_teams -> show customers whose orderStatus is orderPlaced 