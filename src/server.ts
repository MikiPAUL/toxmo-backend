import express from 'express';
import router from './routes/index'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

const app = express()

app.use(bodyParser.json())

app.use(router)

app.listen(3000, () => {
    console.log(`app listening on port ${3000}`);
});