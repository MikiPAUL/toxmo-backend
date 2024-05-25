import express from 'express'
import router from './routes/index'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { weeklyReportScheduler } from './lib/jobs/updateTeamStatus'
import winston from 'winston'
// import morgan from 'morgan'
import morganBody from 'morgan-body'
import 'winston-daily-rotate-file'
import cors from 'cors'
// import path from 'node:path'
// import fs from 'fs'

dotenv.config({ path: __dirname + '/../.env', debug: true })

declare global {
    namespace Express {
        interface Request {
            userId: number
        }
    }
}

// interface ILogData {
//     headers?: any
//     method: string | undefined,
//     url: string | undefined,
//     status: string | undefined,
//     contentLength: string | undefined,
//     responseTime: string | undefined,
//     requestBody?: string,
//     userId?: number,
//     responseBody?: any
// }

const app = express()

weeklyReportScheduler.start()

const corsOptions = {
    AccessControlAllowOrigin: '*',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

// const morganMiddleware = morgan(
//     (tokens, req: Request, res: Response) => {
//         let originalJson = res.json
//         let originalSend = res.send
//         const logData: ILogData = {
//             method: tokens.method(req, res),
//             url: tokens.url(req, res),
//             status: tokens.status(req, res),
//             contentLength: tokens.res(req, res, 'content-length'),
//             responseTime: tokens['response-time'](req, res)
//         }
//         if (req.body) {
//             logData.requestBody = req.body
//         }
//         if (req.userId) {
//             logData.userId = req.userId
//         }
//         if (req.headers) {
//             logData.headers = req.headers
//         }

//         res.json = function (body) {
//             console.log('here')
//             logData.responseBody = body
//             return originalJson.call(this, body)
//         }

//         res.send = function (body) {
//             console.log('here')
//             logData.responseBody = body
//             return originalSend.call(this, body)
//         }

//         return JSON.stringify(logData)
//     },
//     {
//         stream: {
//             write: (message) => {
//                 const data = JSON.parse(message);
//                 logger.http(`incoming-request`, data);
//             },
//         },
//     }
// )

// app.use(morganMiddleware)

const { combine, timestamp, simple } = winston.format

export const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }), simple()),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'logs/info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'info',
            zippedArchive: true
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'error',
            zippedArchive: true
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/http-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'http',
            zippedArchive: true
        })
    ]
})

const loggerStream = {
    write: (message: string) => {
        logger.http(message)
        return true
    }
}

morganBody(app, { stream: loggerStream, noColors: true, logRequestBody: true, logAllReqHeader: true, immediateReqLog: true })

app.use(router)

app.listen(process.env.PORT, () => {
    logger.http(`app listening on port ${process.env.PORT}`);
})