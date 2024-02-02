import { z } from 'zod'

const productParams = z.object({
    product: z.object({
        name: z.string(),
        price: z.number(),
        categoryId: z.number(),
        teamPrice: z.number(),
        teamSize: z.number(),
        stockQuantity: z.number(),
        otherDetails: z.record(z.string(), z.unknown())
    })
})

const productReviewParams = z.object({
    review: z.object({
        productId: z.number(),
        description: z.string(),
        rating: z.number()
    })
})

export {
    productParams,
    productReviewParams
}