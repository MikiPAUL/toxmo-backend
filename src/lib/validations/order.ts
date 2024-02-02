import { z } from 'zod'

const orderParams = z.object({
    order: z.object({
        productId: z.number(),
        quantity: z.number(),
        totalPrice: z.number(),
        purchaseType: z.enum(['team', 'individual']),
        teamId: z.number().optional()
    })
})

export { orderParams }
