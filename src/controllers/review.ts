import prisma from "../models/review"
import { createReviewParams } from "../lib/validations/review"
import { Request, Response } from "express"

const create = async (req: Request, res: Response) => {
    try {
        const createReviewRequest = createReviewParams.safeParse(req.body)
        if (!createReviewRequest.success) return res.status(422).json({ error: 'Invalid request body' })

        const reviewDetails = createReviewRequest.data.review
        const review = await prisma.review.add({ ...reviewDetails, userId: req.userId })
        res.status(200).json({ review })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to post reviews' })
    }
}

export {
    create
}