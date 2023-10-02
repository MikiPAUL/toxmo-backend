import {z} from 'zod'

const orderParams = z.object({
    order: z.object({
        productId: z.number(),  
        purchaseType: z.enum(['team', 'individual'])
    })
})

export {orderParams}