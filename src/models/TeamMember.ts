// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient().$extends({
//     model: {
//         teamMember: {
//             async addTeamMember(teamId: number, userId: number) {
//                 return prisma.teamMember.create({
//                     data: {
//                         teamId: teamId, userId
//                     }
//                 })
//             },
//             async switchTeam(teamMemberId: number, newTeamId: number, userId: number) {
//                 await prisma.teamMember.delete({
//                     where: {
//                         id: teamMemberId
//                     }
//                 })
//                 await prisma.teamMember.create({
//                     data: {
//                         userId, teamId: newTeamId
//                     }
//                 })
//             },
//         }
//     }
// });

// export default prisma;