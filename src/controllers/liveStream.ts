import { Request, Response, response } from "express"
import prisma from "../models/liveStream"
import { liveStreamParams } from "../lib/validations/liveStream"
import { User } from "@prisma/client"
import { number } from "zod"

interface HandleRequest extends Request {
    params: {
        id: string
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const liveStreamReq = liveStreamParams.safeParse(req.body)
        if (!liveStreamReq.success) throw new Error('invalid params')

        const seller = await prisma.seller.findUnique({
            where: {
                id: req.userId
            }
        })

        if (!seller) throw new Error('Create seller account to start live stream')

        const { meetId, description } = liveStreamReq.data.liveStream

        if (!liveStreamReq.data.liveStream || !meetId || !description) throw new Error('Invalid request params')

        const liveStream = await prisma.liveStream.create({
            data: {
                sellerId: seller.id,
                meetId, description
            }
        })

        res.status(200).json({ liveStream: liveStream })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to create livestream' })
    }
}

const edit = async (req: Request, res: Response) => {
    try {
        const liveStreamReq = liveStreamParams.safeParse(req.body)
        if (!liveStreamReq.success) throw new Error('invalid params')

        const seller = await prisma.seller.findUnique({
            where: {
                id: req.userId
            }
        })

        if (!seller || !liveStreamReq.data.liveStream.expiresAt) throw new Error('Create seller account to start live stream')

        const liveStream = await prisma.liveStream.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                expiresAt: new Date(liveStreamReq.data.liveStream.expiresAt).toISOString()
            }
        })

        res.status(200).json({ liveStream })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to end livestream' })
    }
}

const index = async (req: Request, res: Response) => {
    try {
        const followingSellers = await prisma.relationship.findMany({
            where: {
                followerId: req.userId
            },
            select: {
                follower: {
                    select: {
                        seller: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        })

        const sellerIds: number[] = []
        followingSellers.forEach((followingSeller) => {
            const sellerId = followingSeller.follower.seller?.id
            if (sellerId) sellerIds.push(sellerId)
        })

        const livestreams = await prisma.liveStream.findMany({
            where: {
                sellerId: {
                    in: sellerIds
                },
                expiresAt: {
                    gt: new Date()
                }
            }
        })
        res.status(200).json({ livestreams })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to get livestream details' })
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
    create,
    edit,
    index,
}