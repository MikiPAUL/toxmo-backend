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
            },
            async liveStreamingSeller() {
                return prisma.liveStream.findMany({
                    where: {
                        expiresAt: {
                            gt: new Date()
                        }
                    },
                    select: {
                        sellerId: true
                    }
                })
            }
        }
    }
})

export default prisma;