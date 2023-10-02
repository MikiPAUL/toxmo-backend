import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        team: {
            async formTeam(order_id: number, partner_id: number){
                return prisma.order.update({
                    data:{
                        team: {
                            create: { partnerId: partner_id }
                        }
                    },
                    where: {
                        id: order_id
                    }
                })
            },
            async formedTeamList(product_id: number){
                return prisma.order.findMany({
                    where: {
                        productId: product_id,
                        orderStatus: OrderStatus.orderPlaced,
                        expireAt: {
                            lte: new Date()
                        }
                    }
                })
            }
        }
    }
})

export default prisma
