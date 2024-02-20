import { z } from "zod";

const authParams = z.object({
    auth: z.object({
        phoneNumber: z.string().length(10)
    })
})

const verifyotpParams = z.object({
    auth: z.object({
        phoneNumber: z.string().length(10),
        otp: z.string().length(4)
    })
})

const adminLoginParams = z.object({
    auth: z.object({
        username: z.string(),
        password: z.string()
    })
})

export {
    authParams,
    verifyotpParams,
    adminLoginParams
};