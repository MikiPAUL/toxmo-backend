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

export {
    authParams,
    verifyotpParams
};