import { z } from 'zod'

const addressParams = z.object({
    address1: z.string(),
    address2: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pincode: z.string()
})

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
        type: z.string(),
        categoryId: z.number(),
        email: z.string(),
        deliveryType: z.enum(['noDelivery', 'thirdPartyDelivery', 'ownDelivery']),
        address: addressParams,
        deliveryFee: z.number().nullable(),
        thirdPartyLink: z.string().nullable(),
        deliveryRadius: z.number().nullable()
    })
})

const updateSellerParams = z.object({
    seller: z.object({
        active: z.boolean()
    })
})

const followParams = z.object({
    follow: z.object({
        userId: z.number()
    })
})

const editProfileParams = z.object({
    user: z.object({
        address: addressParams
    })
})

export {
    userParams,
    sellerParams,
    followParams,
    editProfileParams,
    updateSellerParams
}