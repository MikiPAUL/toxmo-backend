import { z } from 'zod'

const productParams = z.object({
    product: z.object({
        name: z.string(),
        price: z.number(),
        description: z.string(),
        stockQuantity: z.number()
    })
})

const productUpdateParams = z.object({
    product: z.object({
        name: z.string().optional(),
        price: z.number().optional(),
        description: z.string().optional(),
        stockQuantity: z.number().optional()
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
    productReviewParams,
    productUpdateParams
}