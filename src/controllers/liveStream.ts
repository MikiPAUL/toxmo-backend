import { Request, Response } from "express"
import prisma from "../models/liveStream"
import { liveStreamParams } from "../lib/validations/liveStream"

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

        res.status(200).json({ liveStream })
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
                expiresAt: new Date()
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
        const streamType = req.query.streamType as string
        const queryCategory = req.query.categoryId as string
        const categoryId: number | undefined = parseInt(queryCategory) || undefined

        var sellerIds: number[] | undefined;
        if (streamType === 'following') {
            sellerIds = (await prisma.relationship.findMany({
                where: {
                    followerId: req.userId
                },
                select: {
                    followingId: true
                }
            })).flatMap(seller => seller.followingId)
        }

        const activeLiveStream = await prisma.liveStream.findMany({
            where: {
                sellerId: {
                    in: sellerIds
                },
                Seller: {
                    categoryId
                },
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                Seller: {
                    select: {
                        id: true, brandName: true
                    }
                }
            }
        })

        res.status(200).json({ livestreams: activeLiveStream })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to get livestream details' })
    }
}

export {
    create,
    edit,
    index,
}