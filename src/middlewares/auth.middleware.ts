import { NextFunction, Request, Response } from "express";
import { validateToken } from '../lib/utils/authToken';


const authUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('authorization');

    if (token && validateToken(token)) next();
    else res.status(401).json({ success: false, message: "Unauthorized" })
}

export { authUser }