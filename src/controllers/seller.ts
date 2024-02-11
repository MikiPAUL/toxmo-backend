import prisma from "../models/seller";
import { Request, Response } from "express";
import currentUser from "../lib/utils/getCurrentUser";
import { followParams } from "../lib/validations/user";

const shopReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.seller.shopReviews(req.userId);

        res.status(200).json({ reviews })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Error while fetching shop reviews' })
    }
}

const shopDetails = async (req: Request, res: Response) => {
    try {
        const shopDetails = await prisma.seller.sellerInfo(req.userId);
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