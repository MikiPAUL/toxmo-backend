import prisma from '../models/user';
import {authParams, verifyotpParams} from '../lib/validations/authentication'
import {Request, Response} from 'express';
import IauthResponse from 'authentication';
import sendOtp from '../services/verifyOTP';

const signIn = async (req: Request, res: Response): Promise<Response<IauthResponse, Record<string, string>>>  => {
    const result = authParams.safeParse(req.body)
    console.log(result)
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
    req.sessionID = user.id.toString()
    return res.status(200).json({})
}


const verifyOTP = async(req: Request, res: Response) => {
    const request = verifyotpParams.safeParse(req.body)
    if(!request.success){
        return res.status(422)
    }
    const isValidOtp = await prisma.user.validOTP(request.data.auth.phone_number, request.data.auth.otp)

    if(isValidOtp){
        res.status(200).json({sucess: true})
    }
    else{
        res.status(401).json({success: false})
    }
}


export {
    signIn,
    verifyOTP
}
