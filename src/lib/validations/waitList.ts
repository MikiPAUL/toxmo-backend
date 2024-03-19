import { z } from 'zod'

const waitListParams = z.object({
    waitList: z.object({
        name: z.string(),
        location: z.string(),
        phoneNumber: z.string(),
        email: z.string()
    })
})

export {
    waitListParams
}