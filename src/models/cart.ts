import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        cart: {
            addItem(userId: number, productId: number) {
                return prisma.cart.create({
                    data: {
                        userId, productId
                    }
                })
            },
            removeItem(userId: number, productId: number) {
                return prisma.cart.delete({
                    where: {
                        productId_userId: {
                            userId, productId
                        }
                    }
                })
            },
            changeQuantity(userId: number, productId: number, quantity: number) {
                return prisma.cart.update({
                    where: {
                        productId_userId: {
                            userId, productId
                        }
                    },
                    data: {
                        quantity
                    }
                })
            },
            async cartShopList(userId: number) {
                const shopList = (await prisma.cart.findMany({
                    where: {
                        userId
                    },
                    select: {
                        product: {
                            select: {
                                seller: {
                                    select: {
                                        id: true, brandName: true
                                    }
                                }
                            }
                        }
                    }
                })).flatMap(shop => shop.product)
                return shopList.filter((value, index, array) => array.indexOf(value) === index)
            },
            async cartDetails(userId: number, sellerId: number) {
                return prisma.cart.findMany({
                    where: {
                        userId,
                        product: {
                            seller: {
                                id: sellerId
                            }
                        }
                    },
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                name: true, imageLink: true, stockQuantity: true
                            }
                        }
                    }
                })
            },
            async deleteCart(userId: number, sellerId: number) {
                return prisma.cart.deleteMany({
                    where: {
                        userId,
                        product: {
                            seller: {
                                id: sellerId
                            }
                        }
                    }
                })
            },
            async checkProductAlreadyInCart(userId: number, productId: number) {
                return (await prisma.cart.findUnique({
                    where: {
                        productId_userId: {
                            productId, userId
                        }
                    }
                })) != null
            }
        }
    }
})

export default prisma