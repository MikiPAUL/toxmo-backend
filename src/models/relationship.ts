import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient().$extends({
    model: {
        relationship: {
            followUser(followerId: number, followingId: number) {
                return prisma.relationship.create({
                    data: {
                        followerId, followingId
                    }
                })
            }
        }
    }
})

export default prisma
