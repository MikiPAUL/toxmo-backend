import {z} from 'zod'

const userParams = z.object({
    user: z.object({
        username: z.string(),
        phone_number: z.string()
    })
})

const profileParams = z.object({
    user: z.object({
        id: z.number()
    })
})

export {
    userParams,
    profileParams
}