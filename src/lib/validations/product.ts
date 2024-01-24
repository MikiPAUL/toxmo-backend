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

export {
    productParams
}