import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        category: {
            async all() {
                return prisma.category.findMany({
                })
            },
            async add(createParams: { categoryName: string }) {
                return prisma.category.create({
                    data: createParams
                })
            }
        }
    }
})

export {
    prisma
}