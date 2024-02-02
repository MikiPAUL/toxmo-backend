import { Request, Response } from "express";
import prisma from "../models/TeamMember";
import { TeamStatus, OrderStatus } from "@prisma/client";
import teamPrisma from "../models/team";
import currentUser from "../lib/utils/getCurrentUser";

const addTeamMember = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req);
        const teamId = req.params.id;
        const team = await prisma.team.findUnique({
            where: {
                id: parseInt(teamId)
            },
            select: {
                id: true,
                Product: {
                    select: {
                        teamSize: true
                    }
                }
            }
        });

        if (!team || !team.Product) throw new Error('Unable to join the team')
        const teamMember = await prisma.teamMember.addTeamMember(team.id, user.id);

        if (!teamMember) throw new Error('Unable to join the team');
        const teamMemberCount = await teamPrisma.team.teamMembersCount(team.id);
        const maxTeamCapacity = team.Product.teamSize;

        if (teamMemberCount?._count.teamMembers == maxTeamCapacity) {
            await teamPrisma.team.update({
                where: {
                    id: team.id
                },
                data: {
                    teamStatus: TeamStatus.teamConfirmed
                }
            })
            await prisma.order.updateMany({
                where: {
                    teamId: team.id
                },
                data: {
                    orderStatus: OrderStatus.productShipped
                }
            })
        }

        const teamDetails = await prisma.team.findUnique({
            where: {
                id: team.id
            },
            include: {
                teamMembers: true
            }
        })

        res.status(200).json({ team: teamDetails })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to join the team' })
    }
}

export {
    addTeamMember
}