import { PrismaClient, TeamStatus } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        team: {
            async createTeam(productId: number) {
                return prisma.team.create({
                    data: {
                        productId
                    }
                })
            },
            async teamMembersCount(id: number) {
                return prisma.team.findUnique({
                    where: {
                        id
                    },
                    include: {
                        _count: {
                            select: { teamMembers: true }
                        }
                    }
                });
            },
            async changeTeamStatus(id: number, status: TeamStatus) {
                return prisma.team.update({
                    where: {
                        id
                    },
                    data: {
                        teamStatus: status
                    }
                })
            },
            async existingTeamList(productId: number) {
                return prisma.team.findMany({
                    where: {
                        productId,
                        expireAt: {
                            gte: new Date()
                        },
                        teamStatus: TeamStatus.teamCreated
                    }
                })
            }
        }
    }
})

export default prisma
