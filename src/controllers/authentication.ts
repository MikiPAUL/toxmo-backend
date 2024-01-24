import prisma from '../models/user';
import { authParams, verifyotpParams } from '../lib/validations/authentication'
import { Request, Response } from 'express';
import sendOtp from '../services/verifyOTP';
import { generateToken } from '../lib/utils/authToken';

const signIn = async (req: Request, res: Response) => {
    try {
        const result = authParams.safeParse(req.body)
        if (!result.success) {
            return res.status(422).json({})
        }
        const user = await prisma.user.findUnique({
            where: {
                phoneNumber: result.data.auth.phoneNumber
            }
        })
        if (!user) {
            return res.status(404).json({ status: "User doesn't exist" })
        }
        const otp_response = await sendOtp(result.data.auth.phoneNumber)
        if (!otp_response) throw new Error('Unable to send OTP')
        await prisma.user.storeOTP(user.id, otp_response)
        res.status(200).json(
            {
                success: true,
                message: 'OTP sent successfully'
            }
        )
    }
    catch (e) {
        res.status(422).json({ error: e || "Something went wrong" })
    }
}

const verifyOTP = async (req: Request, res: Response) => {
    const request = verifyotpParams.safeParse(req.body)
    if (!request.success) {
        return res.status(422).json({ status: false, message: "Unable to verify otp" })
    }
    const user = await prisma.user.validOTP(request.data.auth.phoneNumber, request.data.auth.otp)

    if (user) {
        const token = generateToken(user.id)
        res.status(200).json({ success: true, message: 'Successfully Logged In', token })
    }
    else {
        res.status(401).json({ error: 'Try resending the otp' })
    }
}

export {
    signIn,
    verifyOTP
}