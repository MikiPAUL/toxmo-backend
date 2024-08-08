import { PrismaClient, OrderStatus } from "@prisma/client";
import { checkWithinDeliveryDistance } from "../services/gmaps";

type ProductSchema = {
    productId: number,
    quantity: number
}

type OrderDetailSchema = {
    totalPrice: number,
    products: ProductSchema[],
    sellerId: number
}

const prisma = new PrismaClient().$extends({
    model: {
        order: {
            async add(userId: number, orderDetails: OrderDetailSchema) {
                const { sellerId, totalPrice, ...orderItems } = orderDetails
                return prisma.order.create({
                    data: {
                        totalPrice, userId, sellerId,
                        OrderItem: {
                            createMany: {
                                data: orderItems.products
                            }
                        }
                    }
                })
                // const userAddress = (await prisma.user.findUnique({
                //     where: {
                //         id: userId
                //     },
                //     select: {
                //         address: true
                //     }
                // }))?.address
                // const sellerAddress = await prisma.seller.findUnique({
                //     where: {
                //         id: orderDetails.sellerId
                //     },
                //     select: {
                //         address: true
                //     }
                // })?.address

                // if (!userAddress || !sellerAddress) throw new Error('Invalid Address to place order')
                // const withinDeliveryDistance = await checkWithinDeliveryDistance(seller, userAddress, sellerAddress)

                // if (!withinDeliveryDistance) throw new Error('Out of delivery distance')
                // return await prisma.order.create({
                //     data: {
                //         userId,
                //         ...orderDetails
                //     }
                // })
            },
            async all(userId: number) {
                return prisma.order.findMany({
                    where: {
                        userId: userId
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
                        OrderItem: {
                            select: {
                                Product: {
                                    select: {
                                        id: true, description: true, imageLink: true, name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            },
            async updateOrderStatus({ orderId, status }: { orderId: number, status: OrderStatus }) {
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