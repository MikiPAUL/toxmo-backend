import { Request, Response } from "express";
import { formTeamParams } from "../lib/validations/team";
import prisma from "../models/team";

const formTeam = async (req: Request, res: Response) => {
    const parsedParams = formTeamParams.safeParse(req.body)

    if(!parsedParams.success){
        return res.status(422).json({error: "Unable to form a team"})
    }
    const {order_id, partner_id} = parsedParams.data.team
    const order = await prisma.order.findUnique({ where: { id: order_id }})
    if(!order){
        return res.status(404).json({error: "Unable to find the order"})
    }
    const team = await prisma.team.formTeam(order_id, partner_id)
    if(!team){
        return res.status(422).json({error: "Unable to form team"})
    }
    res.json(team)
}

const existingTeamList = async (req: Request, res: Response) => {
    const product_id = parseInt(req.params.id);
    const teamListing = await prisma.team.formedTeamList(product_id)
    res.json({existingTeam: teamListing})
}

export {
    formTeam,
    existingTeamList
}