import { Request } from "express";
import prisma from "../../models/user";
import { User } from "@prisma/client";

const currentUser = async (req: Request): Promise<User | null> => {
    const user_id = req.session.user_id;
    const user = await prisma.user.findUnique({
        where: {
            id: user_id
        }
    })
    return user
}

export default currentUser