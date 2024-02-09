import { Request, Response } from 'express';
import { userParams, sellerParams, editProfileParams } from '../lib/validations/user';
import prisma from '../models/user';
import type { User } from '@prisma/client'
import sendOtp from '../services/verifyOTP';

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

        await prisma.user.storeOTP(req.userId, otp_response)
        res.status(200).json(
            {
                success: true,
                message: 'OTP sent successfully'
            }
        )
    }
    catch (e) {
        if (e instanceof Error) return res.status(422).json({ error: e.message })
        res.status(422).json({ error: 'Something went wrong' })
    }
}

const applyToSell = async (req: Request, res: Response) => {
    try {
        const sellerRequest = sellerParams.safeParse(req.body);
        if (!sellerRequest.success) return res.status(422).json({ error: 'Invalid request params' })

        const seller = await prisma.seller.create({
            data: {
                userId: req.userId,
                ...sellerRequest.data.seller,
                active: true
            }
        })
        res.status(201).json({ seller })
    }
    catch (e) {
        if (e instanceof Error) return res.status(422).json({ error: e.message })
        res.send(422).json({ error: 'Something went error' })
    }
}

const editProfile = async (req: Request, res: Response) => {
    try {
        const editProfileRequest = editProfileParams.safeParse(req.body);
        if (!editProfileRequest.success) throw new Error('Unable to edit user profile')

        const updatedUser = await prisma.user.update({
            where: {
                id: req.userId
            },
            data: {
                address: editProfileRequest.data.user.address
            }
        })

        res.status(200).json({ user: serializeUser(updatedUser) })
    }
    catch (e) {
        if (e instanceof Error) return res.status(422).json({ error: e.message })
        res.send(422).json({ error: 'Something went error' })
    }
}


const profile = async (req: Request, res: Response) => {
    try {
        const seller = await prisma.seller.findUnique({
            where: {
                userId: req.userId
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            }
        })
        if (!user) return;
        res.json({
            user: { ...serializeUser(user), seller }
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Something went wrong' })
    }
}

function serializeUser(user: User) {
    return {
        "id": user.id,
        "username": user.username,
        "avatar": user.avatar,
        "address": user.address,
        "phoneNumber": user.phoneNumber,
        "gender": user.gender,
    }
}


export {
    createUser,
    profile,
    applyToSell,
    editProfile
}