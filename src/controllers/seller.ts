import prisma from "../models/seller";
import { Request, Response } from "express";

const shopReviews = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string
        const reviews = await prisma.seller.shopReviews(parseInt(userId));

        res.status(200).json({ reviews })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop reviews' })
    }
}

const shopDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;

        const shopDetails = await prisma.seller.sellerInfo(parseInt(userId));
        res.json({ seller: shopDetails })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop details' })
    }
}

export {
    shopReviews,
    shopDetails
}