import { Request, Response } from "express";
import { createTeamParams } from "../lib/validations/team";
import prisma from "../models/team";
import orderPrisma from '../models/order'
import teamMemberPrisma from "../models/TeamMember";
import { IOrderDetails } from "order";

const serializeOrder = (order: IOrderDetails) => {
    const { team, ...orderDetail } = order
    return {
        ...orderDetail,
        expireAt: team?.expireAt || null,
        teamMemberCount: team?._count.teamMembers || null
    }
}

const createTeam = async (req: Request, res: Response) => {
    try {
        const parsedParams = createTeamParams.safeParse(req.body);
        if (!parsedParams.success) throw new Error('Unable to create team')

        const { productId } = parsedParams.data.team;

        const { newTeam, newTeamMember, orderId } = await prisma.$transaction(async (prisma) => {
            const newTeam = await prisma.team.createTeam(productId);
            const newTeamMember = await teamMemberPrisma.teamMember.addTeamMember(newTeam.id, req.userId);
            const order = await orderPrisma.order.add(req.userId, { ...parsedParams.data.team, purchaseType: 'team', teamId: newTeam.id })

            return { newTeam, newTeamMember, orderId: order.id }
        });
        const order = (await orderPrisma.order.orderDetails([orderId])).at(0)
        if (!newTeam) throw new Error('Unable to create team')
        else if (!newTeamMember) throw new Error('Unable to join team')
        else if (!order) throw new Error('Unable to create order')

        res.status(200).json({ order: serializeOrder(order) })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e });
        else res.status(422).json({ error: 'Unable to join team' })
    }
}

const existingTeamList = async (req: Request, res: Response) => {
    try {

        if (!req.query.productId) throw new Error('Unable to fetch team list');
        const productId = req.query.productId as string;

        if (!productId) throw new Error('Something went wrong')

        const teams = await prisma.team.existingTeamList(parseInt(productId), req.userId);

        res.status(200).json({ teams })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to fetch team list' })
    }
}

const showTeam = async (req: Request, res: Response) => {
    try {
        const teamId = req.params.id as string;

        if (!teamId) throw new Error('Unable to fetch team details')

        const team = await prisma.team.findUnique({
            where: {
                id: parseInt(teamId)
            },
            include: {
                teamMembers: true
            }
        })
        res.status(200).json({ team })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
    }
}

export {
    createTeam,
    showTeam,
    existingTeamList
}