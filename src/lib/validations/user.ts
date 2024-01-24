import { z } from 'zod'

const userParams = z.object({
    user: z.object({
        username: z.string(),
        phoneNumber: z.string()
    })
})

const profileParams = z.object({
    user: z.object({
        id: z.number()
    })
})

const sellerParams = z.object({
    seller: z.object({
        brandName: z.string(),
        bio: z.string(),
        active: z.boolean(),
        contactNumber: z.string(),
        storeAddress: z.string(),
        type: z.string(),
        category: z.string(),
        email: z.string()
    })
})

export {
    userParams,
    profileParams,
    sellerParams
}