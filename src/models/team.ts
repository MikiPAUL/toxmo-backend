// import { OrderStatus, PrismaClient, TeamStatus } from "@prisma/client";

// const prisma = new PrismaClient().$extends({
//     model: {
//         team: {
//             async createTeam(productId: number) {
//                 return prisma.team.create({
//                     data: {
//                         productId
//                     }
//                 })
//             },
//             async teamMembersCount(id: number) {
//                 return prisma.team.findUnique({
//                     where: {
//                         id
//                     },
//                     include: {
//                         _count: {
//                             select: { teamMembers: true }
//                         }
//                     }
//                 });
//             },
//             async changeTeamStatus(id: number, status: TeamStatus) {
//                 return prisma.team.update({
//                     where: {
//                         id
//                     },
//                     data: {
//                         teamStatus: status
//                     }
//                 })
//             },
//             async existingTeamList(productId: number, userId: number) {
//                 return prisma.team.findMany({
//                     include: {
//                         teamMembers: true
//                     },
//                     where: {
//                         productId,
//                         expireAt: {
//                             gte: new Date()
//                         },
//                         teamStatus: TeamStatus.teamCreated,
//                         NOT: {
//                             teamMembers: {
//                                 some: {
//                                     userId
//                                 }
//                             }
//                         }
//                     },
//                 })
//             },
//             async updateTeamExpireStatus() {
//                 await prisma.$transaction(async (prisma) => {
//                     const teamId = (await prisma.team.findMany({
//                         where: {
//                             expireAt: {
//                                 lte: new Date()
//                             },
//                             NOT: {
//                                 teamStatus: TeamStatus.teamExpired
//                             }
//                         },
//                         select: {
//                             id: true
//                         }
//                     })).flatMap(team => team.id)
//                     await prisma.team.updateMany({
//                         where: {
//                             id: {
//                                 in: teamId
//                             }
//                         },
//                         data: {
//                             teamStatus: TeamStatus.teamExpired
//                         }
//                     })
//                     await prisma.order.updateMany({
//                         where: {
//                             teamId: {
//                                 in: teamId
//                             }
//                         },
//                         data: {
//                             orderStatus: OrderStatus.orderExpired
//                         }
//                     })
//                     const productQuantities = await prisma.order.groupBy({
//                         by: ['productId'],
//                         _sum: {
//                             quantity: true
//                         },
//                         where: {
//                             teamId: {
//                                 in: teamId
//                             }
//                         }
//                     })
//                     const updateStocks = productQuantities.map(async (productQuantity) => {
//                         if (!productQuantity.productId || !productQuantity._sum.quantity) return
//                         await prisma.product.update({
//                             where: {
//                                 id: productQuantity.productId
//                             },
//                             data: {
//                                 stockQuantity: {
//                                     increment: productQuantity._sum.quantity
//                                 }
//                             }
//                         })
//                     })
//                     await Promise.all(updateStocks)
//                 })
//             }
//         }
//     }
// })

// export default prisma
