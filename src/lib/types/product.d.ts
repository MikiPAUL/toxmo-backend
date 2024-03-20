import { Prisma } from '@prisma/client'

type IProductDetails = Prisma.ProductGetPayload<{
    include: {
        seller: true
    }
}>

export {
    IProductDetails
}