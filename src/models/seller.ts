import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        seller: {
            async sellerInfo(id: number) {
                return prisma.seller.findUnique({
                    where: {
                        id
                    },
                    include: {
                        products: {
                            include: {
                                orders: true
                            }
                        }
                    }
                })
            },
            async shopReviews(id: number) {
                const productIds = await prisma.product.findMany({
                    where: {
                        sellerId: id
                    },
                    select: {
                        id: true
                    }
                })
                return prisma.review.findMany({
                    where: {
                        productId: {
                            in: productIds.map(productId => productId.id)
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