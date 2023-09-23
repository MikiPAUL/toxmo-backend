import {z} from 'zod'

const userParams = z.object({
    user: z.object({
        username: z.string(),
        phone_number: z.string()
    })
})

export {
    userParams
}