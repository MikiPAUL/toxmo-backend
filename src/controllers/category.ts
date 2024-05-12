import { Request, Response } from "express"
import { prisma } from "../models/category"
import { categoryParams } from "../lib/validations/category"

const index = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                categoryName: true
            }
        })
        res.status(200).json({ categories })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: 'Unable to fetch category details' })
        else res.status(422).json({ error: 'Unable to fetch category details' })
    }
}

const create = async (req: Request, res: Response) => {
    const categoryRequest = categoryParams.safeParse(req.body)

    if (!categoryRequest.success) {
        return res.status(422).json({ error: "Unable to create category" })
    }
    const categoryDetails = categoryRequest.data.category
    const category = await prisma.category.add(categoryDetails)
    if (!category) {
        return res.status(422).json({ error: "Unable to create category" })
    }
    const { createdAt, updatedAt, ...responseCategory } = category
    res.status(200).json({ category: responseCategory })
}



export {
    index,
    create
}