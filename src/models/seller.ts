import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        seller: {
            async sellerInfo(userId: number) {
                return prisma.seller.findUnique({
                    where: {
                        userId
                    }
                })
            }
        }
    }
})

export default prisma;