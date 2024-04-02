import express from 'express'
import router from './routes/index'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { weeklyReportScheduler } from './lib/jobs/updateTeamStatus'
import winston from 'winston'
import morgan from 'morgan'
import { IncomingMessage } from 'http'
import 'winston-daily-rotate-file'
dotenv.config({ path: __dirname + '/../.env', debug: true })

declare global {
    namespace Express {
        interface Request {
            userId: number
        }
    }
}

interface IncomingMessageReq extends IncomingMessage {
    body?: string,
    userId?: number
}

interface ILogData {
    method: string | undefined,
    url: string | undefined,
    status: string | undefined,
    contentLength: string | undefined,
    responseTime: string | undefined,
    requestBody?: string,
    userId?: number
}

const app = express()

weeklyReportScheduler.start()

app.use(bodyParser.json())

const morganMiddleware = morgan(
    (tokens, req, res) => {
        const logData: ILogData = {
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            contentLength: tokens.res(req, res, 'content-length'),
            responseTime: tokens['response-time'](req, res),
        }
        const incomingReq: IncomingMessageReq = req
        if (incomingReq.body) {
            logData.requestBody = incomingReq.body
        }
        if (incomingReq.userId) {
            logData.userId = incomingReq.userId
        }
        return JSON.stringify(logData)
    },
    {
        stream: {
            write: (message) => {
                const data = JSON.parse(message);
                logger.http(`incoming-request`, data);
            },
        },
    }
)

app.use(morganMiddleware)

const { combine, timestamp, json } = winston.format

export const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }), json()),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'info',
            zippedArchive: true
        }),
        new winston.transports.DailyRotateFile({
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'error',
            zippedArchive: true
        }),
        new winston.transports.DailyRotateFile({
            filename: 'http-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'http',
            zippedArchive: true
        })
    ]
})

app.use(router)


app.listen(process.env.PORT, () => {
    logger.info(`app listening on port ${process.env.PORT}`);
});