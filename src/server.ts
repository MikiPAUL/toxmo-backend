import express from 'express';
import router from './routes/index'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { weeklyReportScheduler } from './lib/jobs/updateTeamStatus';
dotenv.config({ path: __dirname + '/../.env', debug: true });


declare global {
    namespace Express {
        interface Request {
            userId: number
        }
    }
}

const app = express()

weeklyReportScheduler.start()

app.use(bodyParser.json())

app.use(router)

app.listen(3000, () => {
    console.log(`app listening on port ${3000}`);
});