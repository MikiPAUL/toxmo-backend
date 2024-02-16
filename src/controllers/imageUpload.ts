import { Request, Response } from "express"
import prisma from "../models/product";

interface HandleRequest extends Request {
    params: {
        id: string
    }
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
                    [field]: file.location
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


export default uploadImage