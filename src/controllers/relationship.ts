import prisma from "../models/relationship";
import { Request, Response } from "express";
import currentUser from "../lib/utils/getCurrentUser";
import { followParams } from "../lib/validations/user";
import { User } from "@prisma/client";

const followUser = async (req: Request, res: Response) => {
    try {
        const followRequest = followParams.safeParse(req.body);

        if (!followRequest.success) throw new Error('Unable to follow the user')
        const followingId = followRequest.data.follow.userId;

        const relationship = await prisma.relationship.followUser(req.userId, followingId);

        res.status(200).json({ relationship })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to follow the user' })
    }
}

const relationshipInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string
        const followers = await prisma.relationship.findMany({
            where: {
                followingId: parseInt(userId)
            },
            select: {
                follower: true
            }
        })
        const followings = await prisma.relationship.findMany({
            where: {
                followerId: parseInt(userId)
            },
            select: {
                following: true
            }
        })
        res.status(200).json({
            relationship: {
                followers: followers.map(follower => serializeUser({ ...follower.follower })),
                followings: followings.map(following => serializeUser({ ...following.following })),
                followersCount: followers.length,
                followingsCount: followings.length
            }
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to follow the user' })
    }
}

function serializeUser(user: User) {
    return {
        "id": user.id,
        "username": user.username,
        "avatar": user.avatar
    }
}


export {
    followUser,
    relationshipInfo
}