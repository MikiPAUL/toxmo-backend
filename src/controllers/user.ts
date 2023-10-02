import { Request, Response } from 'express';
import { userParams, profileParams } from '../lib/validations/user';
import prisma from '../models/user';


const createUser = async (req: Request, res: Response) => {
    const request = userParams.safeParse(req.body)

    if(!request.success){
        return res.status(422).json({})
    }
    const userDetails = request.data.user;
    const status = await prisma.user.add(userDetails.username, userDetails.phone_number)
    if(!status){
        res.status(422).json()
    }
    res.status(200).json()
}

const profile = async (req: Request, res: Response) => {
    const parsedProfileParams = profileParams.safeParse(req.body)
    if(!parsedProfileParams.success){
        return res.status(422).json({error: "Unable to find the user"})
    }
    const user_id = parsedProfileParams.data.user.id
    const user = await prisma.user.findUnique({ where: {id: user_id}})
    res.json({user: user})
}


export {
    createUser,
    profile
}