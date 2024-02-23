import { z } from 'zod'

const createReviewParams = z.object({
    review: z.object({
        productId: z.number(),
        orderId: z.number(),
        description: z.string(),
        rating: z.number()
    })
})

export {
    createReviewParams
}