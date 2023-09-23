import express from 'express';
import router from './routes/index'
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(router)

app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`);
});