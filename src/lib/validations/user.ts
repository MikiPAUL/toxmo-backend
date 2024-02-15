import { z } from 'zod'

const userParams = z.object({
    user: z.object({
        username: z.string(),
        phoneNumber: z.string()
    })
})

const sellerParams = z.object({
    seller: z.object({
        brandName: z.string(),
        bio: z.string(),
        contactNumber: z.string(),
        storeAddress: z.string(),
        type: z.string(),
        categoryId: z.number(),
        email: z.string()
    })
})

const followParams = z.object({
    follow: z.object({
        userId: z.number()
    })
})

const editProfileParams = z.object({
    user: z.object({
        address: z.string()
    })
})

export {
    userParams,
    sellerParams,
    followParams,
    editProfileParams
}