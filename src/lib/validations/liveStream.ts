import { z } from 'zod'

const liveStreamParams = z.object({
    liveStream: z.object({
        meetId: z.string().optional(),
        expiresAt: z.string().optional(),
    })
})

export {
    liveStreamParams
}