import { Request, Response } from 'express'
import { updateSellerParams } from '../../lib/validations/user'
import prisma from '../../models/seller'

const update = async (req: Request, res: Response) => {
    try {
        const updateSellerRequest = updateSellerParams.safeParse(req.body)
        const id = req.params.id as string
        if (!updateSellerRequest.success || !id) return res.status(422).json({ error: 'Invalid request body' })

        const { active } = updateSellerRequest.data.seller
        await prisma.seller.update({
            where: {
                id: parseInt(id)
            },
            data: {
                active
            }
        })
        res.status(200).json({ success: true })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: "Something went wrong" })
    }
}

const index = async (_: Request, res: Response) => {
    try {
        const sellers = await prisma.seller.findMany({
            where: {
                active: false
            }
        })
        res.status(200).json({ sellers })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: "Something went wrong" })
    }
}

export { update, index }
