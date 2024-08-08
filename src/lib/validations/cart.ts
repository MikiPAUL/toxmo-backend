import { z } from 'zod'

const addItemParams = z.object({
    cart: z.object({
        productId: z.number()
    })
})

const updateQuantityParams = z.object({
    cart: z.object({
        quantity: z.number()
    })
})

export { addItemParams, updateQuantityParams }
