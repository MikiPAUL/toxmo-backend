import Queue from 'bull'
import ffmpeg from 'fluent-ffmpeg'
import { logger } from '../server'
import { uploadFile } from './aws-s3'
import prisma from '../models/video'
import fs from 'fs'
import { generateUrl } from "../lib/utils/generateUrl"

const queue = new Queue('thumbnail-generation', process.env.REDIS_URL || '')

queue.process(async (job) => {
    const { videoMetaDataId } = job.data
    const videoUrl = await prisma.videoMetaData.findUnique({
        where: {
            id: videoMetaDataId
        },
        select: {
            url: true
        }
    })
    if (!videoUrl) throw new Error('Invalid video meta data Id')
    const originalName = videoUrl.url, fileLocation = generateUrl(originalName)
    if (!fileLocation) throw new Error('Invalid file location')

    return new Promise(async (resolve, reject) => {
        //Generate thumbnail using ffmpeg
        ffmpeg(fileLocation)
            .screenshots({
                count: 1,
                folder: 'thumbnails',
                filename: `${originalName}.png`,
            })
            .on('progress', (progress) => {
                if (progress.percent) {
                    logger.info(`Processing: ${Math.floor(progress.percent)}% done`)
                }
            })
            // The callback that is run when FFmpeg is finished
            .on('end', async () => {
                logger.info(`FFmpeg has finished`)

                const response = await uploadFile(`thumbnails/${originalName}.png`)
                logger.info(`Thumbnail stored in successfully ${response.Location}`)

                if (!response.Key) {
                    logger.error(`Unable to upload thumbnail for the video ${fileLocation}`)
                    return
                }
                const bit = await prisma.video.updateThumbnailUrl(videoMetaDataId, response.Key)
                if (!bit.thumbnailUrl) logger.error('Error updating thumbnail url')
                logger.info('Thumbnail url updated successfully')

                fs.unlink(`thumbnails/${originalName}.png`, (err) => {
                    if (err) logger.error(err)
                    logger.info(`thumbnail/${originalName} was deleted`)
                })
            })
            // The callback that is run when FFmpeg encountered an error
            .on('error', (error) => {
                logger.error(error)
            })
    })
})

export default queue