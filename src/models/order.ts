import { PrismaClient, PurchaseType } from "@prisma/client";


const prisma = new PrismaClient().$extends({
    model: {
        order: {
            async add(userId: number, orderDetails: {
                productId: number,
                quantity: number,
                purchaseType: PurchaseType,
                totalPrice: number
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
            async find_by(order_id: number) {
                return prisma.order.findUnique({
                    where: {
                        id: order_id
                    }
                })
            }
        }
    }
})

export default prisma