import { Request, Response } from 'express';
import { userParams, profileParams, sellerParams } from '../lib/validations/user';
import prisma from '../models/user';
import { Prisma } from '@prisma/client'
import sendOtp from '../services/verifyOTP';
import currentUser from '../lib/utils/getCurrentUser';

const createUser = async (req: Request, res: Response) => {
    try {
        const request = userParams.safeParse(req.body)

        if (!request.success) {
            return res.status(422).json({ error: 'Invalid request params' })
        }
        const userDetails = request.data.user;

        const existingUserWithUsername = await prisma.user.findUnique({
            where: {
                username: userDetails.username
            }
        })

        if (existingUserWithUsername) {
            throw new Error('User Name is already taken')
        }

        const existingUserWithPhoneNumber = await prisma.user.findUnique({
            where: {
                phoneNumber: userDetails.phoneNumber
            }
        })

        if (existingUserWithPhoneNumber) {
            throw new Error('Phone Number is already taken')
        }

        const user = await prisma.user.add(userDetails.username, userDetails.phoneNumber)

        const otp_response = await sendOtp(request.data.user.phoneNumber)
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
        if (e instanceof Error) return res.status(422).json({ error: e.message })
        console.log(e)
        res.status(422).json({ error: 'Something went wrong' })
    }
}

const applyToSell = async (req: Request, res: Response) => {
    try {
        const sellerRequest = sellerParams.safeParse(req.body);
        if (!sellerRequest.success) return res.status(422).json({ error: 'Invalid request params' })

        const user = await currentUser(req);
        const seller = await prisma.seller.create({
            data: {
                userId: user.id,
                ...sellerRequest.data.seller
            }
        })
        res.status(201).json({ seller })
    }
    catch (e) {
        if (e instanceof Error) return res.status(422).json({ error: e.message })
        res.send(422).json({ error: 'Something went error' })
    }
}

const profile = async (req: Request, res: Response) => {
    const parsedProfileParams = profileParams.safeParse(req.body)
    if (!parsedProfileParams.success) {
        return res.status(422).json({ error: "Unable to find the user" })
    }
    const user_id = parsedProfileParams.data.user.id
    const user = await prisma.user.findUnique({ where: { id: user_id } })
    res.json({ user: user })
}


export {
    createUser,
    profile,
    applyToSell
}