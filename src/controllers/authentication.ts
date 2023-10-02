import prisma from '../models/user';
import {authParams, verifyotpParams} from '../lib/validations/authentication'
import {Request, Response} from 'express';
import IauthResponse from 'authentication';
import sendOtp from '../services/verifyOTP';

declare module 'express-session' {
    interface SessionData {
      user_id: number;
    }
  }

const signIn = async (req: Request, res: Response): Promise<Response<IauthResponse, Record<string, string>>>  => {
    const result = authParams.safeParse(req.body)
    if(!result.success){
        return res.status(422).json({})
    }
    const user = await prisma.user.findUnique({
        where: {
            username: result.data.auth.username,
            phone_number: result.data.auth.phone_number
        }
    })
    if(!user){
        return res.status(401).json({ status: 'failed'})
    }
    const otp = sendOtp(result.data.auth.phone_number)
    await prisma.user.storeOTP(user.id, otp)
    return res.status(200).json(
        {
            success: true, 
            message: 'OTP sent successfully'
        }
    )
}

const verifyOTP = async(req: Request, res: Response) => {
    const request = verifyotpParams.safeParse(req.body)
    if(!request.success){
        return res.status(422).json({status: false, message: "Unable to verify otp"})
    }
    const isValidOtp = await prisma.user.validOTP(request.data.auth.phone_number, request.data.auth.otp)

    if(isValidOtp){
        const user = await prisma.user.findUnique({ where: {phone_number: request.data.auth.phone_number}})
        req.session.user_id = user?.id
        res.status(200).json({success: true, message: 'Successfully Logged In'})
    }
    else{
        res.status(401).json({success: false})
    }
}

export {
    signIn,
    verifyOTP
}
