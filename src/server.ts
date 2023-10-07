import express from 'express';
import router from './routes/index'
import bodyParser from 'body-parser';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 30,
        path    : '/',
    },
}))
app.use(bodyParser.json())

app.use(router)

app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`);
});