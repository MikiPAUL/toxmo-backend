import { z } from 'zod'

const liveStreamParams = z.object({
    liveStream: z.object({
        meetId: z.string().optional(),
        thumbnail: z.string().optional(),
        description: z.string().optional(),
        expiresAt: z.string().optional(),
    })
})

export {
    liveStreamParams
}