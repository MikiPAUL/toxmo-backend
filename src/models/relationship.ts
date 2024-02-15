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
            },
            unFollowUser(followerId: number, followingId: number) {
                return prisma.relationship.delete({
                    where: {
                        followerId_followingId: {
                            followerId, followingId
                        }
                    }
                })
            },
            async alreadyFollowing(followerId: number, followingId: number): Promise<Boolean> {
                const follow = await prisma.relationship.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId, followingId
                        }
                    }
                })
                return follow !== null
            }
        }
    }
})

export default prisma
