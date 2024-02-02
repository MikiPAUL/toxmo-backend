import prisma from "../models/relationship";
import { Request, Response } from "express";
import currentUser from "../lib/utils/getCurrentUser";
import { followParams } from "../lib/validations/user";

const followUser = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req);
        const followRequest = followParams.safeParse(req.body);

        if (!followRequest.success) throw new Error('Unable to follow the user')
        const followingId = followRequest.data.follow.userId;

        const relationship = await prisma.relationship.followUser(user.id, followingId);

        res.status(200).json({ relationship })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to follow the user' })
    }
}

const relationshipInfo = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req);
        const followerCount = await prisma.relationship.count({
            where: {
                followingId: user.id
            }
        })
        const followingCount = await prisma.relationship.count({
            where: {
                followerId: user.id
            }
        })
        res.status(200).json({ relationship: { followerCount, followingCount } })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to follow the user' })
    }
}


export {
    followUser,
    relationshipInfo
}