import {z} from 'zod'

const productParams = z.object({
    product: z.object({
        name: z.string(),
        price: z.number(),
        categoryId: z.number(),
        other_details: z.record(z.string(), z.unknown())
    })
})

export {
    productParams
}