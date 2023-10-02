import { NextFunction, Request, Response } from "express"

function authUser (req : Request, res: Response, next: NextFunction) {
    console.log(req.session.user_id)
    if (req.session.user_id) next()
    else res.status(401).json({success: false, message: "Unauthorized"})
}

export {authUser}