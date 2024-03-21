import { Request, Response } from "express"
import prisma from "../models/product";

interface HandleRequest extends Request {
    params: {
        id: string
    }
}

const generateUrl = (url: string | null | undefined) => {
    if (!url) return null
    return `${process.env['CDN_URL']}/${url}`
}

const uploadImage = async (req: HandleRequest, res: Response) => {
    try {
        const file = req.file as Express.MulterS3.File;
        if (!file) throw new Error('Unable upload image, please try again');
        const id = parseInt(req.params.id), resourceType = req.query.resourceType

        if (resourceType === 'product' || resourceType === 'liveStream') {
            const field = (resourceType === 'product' ? 'imageLink' : 'thumbnail')
            const response = await prisma[resourceType].update({
                where: {
                    id
                },
                data: {
                    [field]: generateUrl(file.key)
                }
            })
            return res.status(200).json({ [resourceType]: response })
        }
        throw new Error('Invalid resource type')
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message });
        else res.status(422).json({ error: 'Unable upload image, please try again' })
    }
}

const uploadVideo = async (req: Request, res: Response) => {
    try {
        const file = req.file as Express.MulterS3.File
        if (!file) throw new Error('Unable upload image, please try again')

        res.status(200).json({
            video: {
                url: generateUrl(file.key)
            }
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to upload video, please try again' })
    }
}


export { uploadImage, uploadVideo }