import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient().$extends({
    model: {
        product: {
            async all() {
                return prisma.product.findMany({
                    include: {
                        category: true
                    }
                })
            },
            async show(id: number) {
                return prisma.product.findUnique({
                    where: {
                        id
                    },
                    include: {
                        seller: true
                    }
                })
            },
            async add(createParams: {
                name: string,
                price: number,
                categoryId: number,
                teamPrice: number,
                teamSize: number,
                sellerId: number,
                stockQuantity: number
            }) {
                return prisma.product.create({
                    data: createParams
                })
            },
            async reduceStockQuantity(productId: number, quantity: number) {
                return prisma.product.update({
                    where: {
                        id: productId
                    },
                    data: {
                        stockQuantity: {
                            decrement: quantity
                        }
                    }
                })
            }
        },
    }
})

export default prisma