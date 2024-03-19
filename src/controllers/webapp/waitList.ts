import { Request, Response } from "express"
import { waitListParams } from "../../lib/validations/waitList"
import prisma from '../../models/waitList'

const create = async (req: Request, res: Response) => {
    try {
        const waitListRequest = waitListParams.safeParse(req.body)
        if (!waitListRequest.success) throw new Error('Invalid params')

        const user = await prisma.waitList.add(waitListRequest.data.waitList)
        res.status(201).json({ user })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: 'Unable to add user to the waitlist' })
        else res.status(422).json({ error: 'Something went wrong' })
    }
}

export {
    create
}