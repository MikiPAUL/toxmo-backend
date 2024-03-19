import { PrismaClient, PurchaseType, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        waitList: {
            async add(userDetails: { name: string, location: string, phoneNumber: string, email: string }) {
                return prisma.waitList.create({
                    data: {
                        ...userDetails
                    }
                })
            }
        }
    }
})

export default prisma