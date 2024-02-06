import { Request } from "express";
import prisma from "../../models/user";
import { User } from "@prisma/client";
import { validateToken } from "./authToken";

const currentUser = async (req: Request): Promise<User> => {
    const token = req.header('Authorization');

    if (!token) throw new Error('Something went wrong');

    const { userId, randomInt } = validateToken(token);

    const userWithRandomSecret = await prisma.user.findUnique({
        where: {
            id: userId,
            randomInt
        }
    })
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) throw new Error('User not found')
    if (!userWithRandomSecret) throw new Error('Token expired')
    return user;
}

export default currentUser;