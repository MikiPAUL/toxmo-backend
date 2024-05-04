import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        video: {
            add(videoMetaDataId: number, productId: number) {
                return prisma.video.create({
                    data: {
                        videoMetaDataId, productId
                    }
                })
            },
            show(id: number) {
                return prisma.video.findUnique({
                    where: {
                        id
                    },
                    select: {
                        id: true, createdAt: true, product: {
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
                        },
                        videoMetaData: {
                            select: {
                                url: true, processedUrl: true, thumbnailUrl: true, id: true
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
            },
            updateThumbnailUrl(videoMetaDataId: number, thumbnailUrl: string) {
                return prisma.videoMetaData.update({
                    where: {
                        id: videoMetaDataId
                    },
                    data: {
                        thumbnailUrl
                    }
                })
            }
        }
    }
})

export default prisma