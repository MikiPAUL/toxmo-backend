import { z } from "zod";

const authParams = z.object({
    auth: z.object({
        username: z.string().min(2).max(50),
        phone_number: z.string().length(10)
    })
})

const verifyotpParams = z.object({
    auth: z.object({
        phone_number: z.string().length(10),
        otp: z.string().length(4)
    })
})

export {
    authParams,
    verifyotpParams
};