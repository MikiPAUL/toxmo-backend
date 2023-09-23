import { Request, Response } from 'express';
import { userParams } from '../lib/validations/user';
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

const update = async (req: Request, res: Response) => {

}

export {
    createUser
}