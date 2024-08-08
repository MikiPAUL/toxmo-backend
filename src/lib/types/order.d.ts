import { Prisma } from '@prisma/client'

// type IOrderDetails = Prisma.OrderGetPayload<{
//     include: {
//         Product: {
//             select: {
//                 id: true, description: true, imageLink: true, name: true, teamSize: true
//             }
//         },
//         team: {
//             select: {
//                 expireAt: true, _count: {
//                     select: { teamMembers: true }
//                 }
//             }
//         }
//     }
// }>

export {
    IOrderDetails
}