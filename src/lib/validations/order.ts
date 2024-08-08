import { z } from 'zod'

const productSchema = z.object({
    productId: z.number(),
    quantity: z.number()
})

const orderParams = z.object({
    order: z.object({
        sellerId: z.number(),
        products: z.array(productSchema),
        totalPrice: z.number(),
        cartOrder: z.boolean()
        // teamId: z.number().optional()
    })
})

export { orderParams }
