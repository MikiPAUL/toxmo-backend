import { Request, Response } from "express";
import { createTeamParams } from "../lib/validations/team";
import prisma from "../models/team";
import teamMemberPrisma from "../models/TeamMember";
import currentUser from "../lib/utils/getCurrentUser";

const createTeam = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req);
        const parsedParams = createTeamParams.safeParse(req.body);
        if (!parsedParams.success) throw new Error('Unable to create team')

        const { productId } = parsedParams.data.team;

        const { newTeam, newTeamMember } = await prisma.$transaction(async (prisma) => {
            const newTeam = await prisma.team.createTeam(productId);
            const newTeamMember = await teamMemberPrisma.teamMember.addTeamMember(newTeam.id, user.id);

            return { newTeam, newTeamMember };
        });

        if (!newTeam) throw new Error('Unable to create team')
        else if (!newTeamMember) throw new Error('Unable to join team')

        const teamDetails = await prisma.team.findUnique({
            where: {
                id: newTeam.id
            },
            include: {
                teamMembers: true
            }
        })
        res.status(200).json({ team: teamDetails })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e });
        else res.status(422).json({ error: 'Unable to join team' })
    }
}

const existingTeamList = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req);

        if (!req.query.productId) throw new Error('Unable to fetch team list');
        const productId = req.query.productId as string;

        if (!productId) throw new Error('Something went wrong')

        const teams = await prisma.team.existingTeamList(parseInt(productId), user.id);

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