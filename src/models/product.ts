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
                        id: id
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
                stockQuantity: number,
                otherDetails: Record<string, any>
            }) {
                return prisma.product.create({
                    data: createParams
                })
            }
        },
    }
})

export default prisma