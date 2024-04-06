import { Request, Response } from "express"
import { bitParams } from "../lib/validations/bit"
import prisma from "../models/video"
import { deleteFile } from "../services/aws-s3"
import queue from "../services/bgService"

const generateUrl = (url: string | null | undefined) => {
    if (!url) return null
    return `${process.env['CDN_URL']}/${url}`
}

const create = async (req: Request, res: Response) => {
    try {
        const bitRequest = bitParams.safeParse(req.body)
        if (!bitRequest.success) throw new Error('invalid params')

        const { url, productId } = bitRequest.data.bit
        const originalName = url.split('/').pop() || url
        const bit = await prisma.video.add(originalName, productId)
        const queueOptions = {
            attempts: 5,
            backoff: 5000
        }
        await queue.add({ fileLocation: url, videoId: bit.id }, queueOptions)

        res.status(200).json({ bit: { ...bit, url } })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to create bit' })
    }
}

const index = async (req: Request, res: Response) => {
    try {
        const sellerId = req.query.sellerId as string
        var bits: { id: number, url: string, thumbnailUrl: string | null }[] = []

        if (sellerId) {
            const stockCondition = req.query.stockCondition as string
            const stockQuantity = (stockCondition === 'active' ? { gt: 0 } : { lte: 0 })

            bits = await prisma.video.findMany({
                where: {
                    product: {
                        stockQuantity,
                        seller: {
                            id: parseInt(sellerId)
                        }
                    }
                },
                select: {
                    id: true, url: true, thumbnailUrl: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        else {
            bits = await prisma.video.findMany({
                where: {
                    product: {
                        stockQuantity: {
                            gt: 0
                        }
                    }
                },
                select: {
                    id: true, url: true, thumbnailUrl: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        res.status(200).json({
            bits: bits.map(bit => {
                return {
                    ...bit, url: generateUrl(bit.url), thumbnailUrl: generateUrl(bit.thumbnailUrl)
                }
            })
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to get bits' })
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const bitId = parseInt(req.params.id)
        const bit = await prisma.video.show(bitId)
        if (!bit) throw new Error('Error in fetching the Bit')

        const liked = await prisma.video.userAlreadyLike(bitId, req.userId) !== null
        res.status(200).json({
            bit: {
                id: bit.id,
                url: generateUrl(bit.url),
                thumbnailUrl: generateUrl(bit.thumbnailUrl),
                createdAt: bit.createdAt,
                productId: bit.product.id,
                price: bit.product.teamPrice,
                sellerId: bit.product.seller.id,
                brandName: bit.product.seller.brandName,
                likes: bit._count.VideoLike,
                liked
            }
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to get bit' })
    }
}

const toggleLike = async (req: Request, res: Response) => {
    try {
        const videoId = parseInt(req.params.id)
        const liked = await prisma.video.userAlreadyLike(videoId, req.userId) !== null

        if (liked) {
            await prisma.videoLike.delete({
                where: {
                    userId_videoId: {
                        userId: req.userId,
                        videoId
                    }
                }
            })
        }
        else {
            await prisma.videoLike.create({
                data: {
                    userId: req.userId, videoId
                }
            })
        }
        res.status(200).json({ bit: { liked: !liked } })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to get bit' })
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const bitId = parseInt(req.params.id)

        const bit = await prisma.video.findUnique({
            where: {
                id: bitId
            },
            select: {
                id: true, url: true
            }
        })
        if (!bit) throw new Error('Unable to delete the video')

        const destroyResponse = await deleteFile(bit.url)
        if (destroyResponse.$metadata.httpStatusCode !== 204) throw new Error('Unable to delete the video')

        await prisma.video.delete({
            where: {
                id: bit.id
            }
        })
        res.sendStatus(204)
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to delete bit' })
    }
}



export {
    create,
    index,
    show,
    toggleLike,
    destroy
}