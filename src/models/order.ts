import { PrismaClient, PurchaseType } from "@prisma/client";


const prisma = new PrismaClient().$extends({
    model:{
        order:{
            async add(user_id: number, product_id: number, purchaseType: PurchaseType){
                return prisma.order.create({
                    data: {
                        productId: product_id,
                        purchaseType: purchaseType,
                        userId: user_id
                    }
                })
            },
            async all(user_id: number){
                return prisma.order.findMany({
                    where: {
                        userId: user_id
                    }
                })
            },
            async find_by(order_id: number){
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