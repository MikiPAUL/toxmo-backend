import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        seller: {
            async sellerInfo(userId: number) {
                return prisma.seller.findUnique({
                    where: {
                        userId
                    },
                    include: {
                        products: true
                    }
                })
            },
            async shopReviews(userId: number) {
                return prisma.seller.findUnique({
                    where: {
                        userId
                    },
                    select: {
                        products: {
                            select: {
                                reviews: true
                            }
                        }
                    }
                })
            }
        }
    }
})

export default prisma;