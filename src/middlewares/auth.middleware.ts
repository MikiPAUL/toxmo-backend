import { Request, Response, NextFunction } from "express";
import { validateToken } from '../lib/utils/authToken';
import currentUser from "../lib/utils/getCurrentUser";

const authUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];
        if (token && validateToken(token).userId) {
            const user = await currentUser(req)
            req.userId = user.id
            next();
        }

        else res.status(401).json({ success: false, message: "Unauthorized" })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ success: false, message: "Unauthorized" })
    }
}

export { authUser }