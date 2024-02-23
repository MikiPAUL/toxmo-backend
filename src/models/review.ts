import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        review: {
            async add(reviewDetails: {
                productId: number,
                orderId: number,
                description: string,
                rating: number,
                userId: number
            }) {
                return prisma.review.create({
                    data: {
                        ...reviewDetails
                    }
                })
            }
        }
    }
})

export default prisma
