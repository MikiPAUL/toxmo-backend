import { PrismaClient } from "@prisma/client";
import moment from "moment";

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
                            where: {
                                stockQuantity: {
                                    gt: 0
                                }
                            }
                        }
                    }
                })
            },
            async outOfStockQuantity(id: number) {
                return prisma.seller.findUnique({
                    where: {
                        id
                    },
                    select: {
                        products: {
                            where: {
                                stockQuantity: {
                                    lte: 0
                                }
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
                    },
                    include: {
                        user: {
                            select: {
                                id: true, username: true
                            }
                        }
                    }
                })
            },
            async liveStreamingSeller() {
                return prisma.liveStream.findMany({
                    where: {
                        expiresAt: {
                            gt: moment().utcOffset("+05:30").format()
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