import { PrismaClient, PurchaseType, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        order: {
            async add(userId: number, orderDetails: {
                productId: number,
                quantity: number,
                purchaseType: PurchaseType,
                totalPrice: number,
                teamId?: number
            }) {
                return await prisma.order.create({
                    data: {
                        userId,
                        ...orderDetails
                    }
                })
            },
            async all(userId: number) {
                return prisma.order.findMany({
                    where: {
                        userId: userId
                    },
                    include: {
                        team: true
                    }
                })
            },
            async orderDetails(orderIds: number[]) {
                return prisma.order.findMany({
                    where: {
                        id: {
                            in: orderIds
                        }
                    },
                    include: {
                        Product: {
                            select: {
                                id: true, description: true, imageLink: true, name: true, teamSize: true
                            }
                        },
                        team: {
                            select: {
                                expireAt: true, _count: {
                                    select: { teamMembers: true }
                                }
                            }
                        }
                    },
                    orderBy: {
                        id: 'desc'
                    }
                })
            },
            async updateOrderStatus({ teamId, orderId, status }: { teamId?: number, orderId?: number, status: OrderStatus }) {
                if (teamId) {
                    return prisma.order.updateMany({
                        where: {
                            teamId: teamId
                        },
                        data: {
                            orderStatus: status
                        }
                    })
                }
                return prisma.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        orderStatus: status
                    }
                })
            }
        }
    }
})

export default prisma