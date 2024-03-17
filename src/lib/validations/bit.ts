import { z } from 'zod'

const bitParams = z.object({
    bit: z.object({
        url: z.string(),
        productId: z.number()
    })
})

export {
    bitParams
}