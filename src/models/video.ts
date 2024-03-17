import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        video: {
            add(url: string, productId: number) {
                return prisma.video.create({
                    data: {
                        url, productId
                    }
                })
            },
            show(id: number) {
                return prisma.video.findUnique({
                    where: {
                        id
                    },
                    select: {
                        id: true, url: true, createdAt: true, product: {
                            select: {
                                id: true, teamPrice: true,
                                seller: {
                                    select: {
                                        id: true, brandName: true
                                    }
                                }
                            }
                        }, _count: {
                            select: {
                                VideoLike: {
                                    where: {
                                        videoId: id
                                    }
                                }
                            }
                        }
                    }
                })
            },
            userAlreadyLike(videoId: number, userId: number) {
                return prisma.videoLike.findUnique({
                    where: {
                        userId_videoId: {
                            userId, videoId
                        }
                    }
                })
            }
        }
    }
})

export default prisma