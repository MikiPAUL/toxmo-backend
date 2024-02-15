import prisma from "../models/relationship";
import { Request, Response } from "express";
import { followParams } from "../lib/validations/user";
import { User } from "@prisma/client";

const followUser = async (req: Request, res: Response) => {
    try {
        const followRequest = followParams.safeParse(req.body);
        const { type } = req.query

        if (type !== 'follow' && type !== 'unfollow') throw new Error('Invalid follow type')
        if (!followRequest.success) throw new Error('Unable to follow the user')
        const followingId = followRequest.data.follow.userId;

        if (type == 'follow') {
            var relationship = await prisma.relationship.followUser(req.userId, followingId);
        }
        else {
            relationship = await prisma.relationship.unFollowUser(req.userId, followingId);
        }

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

const following = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;

        if (!userId) throw new Error('Something went wrong')

        const following = await prisma.relationship.findUnique({
            where: {
                followerId_followingId: {
                    followerId: req.userId,
                    followingId: parseInt(userId)
                }
            }
        })
        res.json({ isFollowing: !(following == null) })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to fetch user following' })
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
    relationshipInfo,
    following
}