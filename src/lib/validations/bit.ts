import { z } from 'zod'

const bitParams = z.object({
    bit: z.object({
        videoMetaDataId: z.number(),
        productId: z.number()
    })
})

const updateParams = z.object({
    bit: z.object({
        processedUrl: z.string()
    })
})

export {
    bitParams,
    updateParams
}