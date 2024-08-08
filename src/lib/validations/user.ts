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

const deliveryOptionSchema = z.object({
    minimumPrice: z.number(),
    deliveryFee: z.number(),
    deliveryRadius: z.number()
})

const sellerParams = z.object({
    seller: z.object({
        brandName: z.string(),
        bio: z.string(),
        contactNumber: z.string(),
        type: z.string(),
        categoryId: z.number(),
        email: z.string(),
        address: addressParams,
        deliveryOptions: z.array(deliveryOptionSchema)
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