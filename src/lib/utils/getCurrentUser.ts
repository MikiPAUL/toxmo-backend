import { Request } from "express";
import prisma from "../../models/user";
import { User } from "@prisma/client";
import { validateToken } from "./authToken";

const currentUser = async (req: Request): Promise<User> => {
    const token = req.header('Authorization');

    if (!token) throw new Error('Something went wrong');

    const user_id = validateToken(token);

    const user = await prisma.user.findUnique({
        where: {
            id: user_id
        }
    })
    if (!user) throw new Error('User not found')
    return user;
}

export default currentUser;