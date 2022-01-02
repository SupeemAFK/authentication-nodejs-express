const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');;
const mongoose = require('mongoose');
const redisClient = require('redis').createClient();
const RedisStore = require('connect-redis')(session);
const authRoute = require('./routes/auth');
const passport = require('passport');
require('./passport/passport');
require('dotenv').config()

function run() {
    const app = express();
    const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true } })

    app.use(cors({
        origin: process.env.CLIENT_URL,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    }));;
    app.use(cookieParser(process.env.SESSION_SECRET))
    app.use(session({
        secret: process.env.SESSION_SECRET,
        store: new RedisStore({ client: redisClient }),
        resave: false,
        saveUninitialized: true,
        cookie: { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 // 1 hour
        }
    }));
    app.use(csrfProtection);//csrf prevention
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/auth', authRoute)

    app.get('/csrf-token', (req, res) => {
        return res.status(200).json({ csrfToken: req.csrfToken() })
    })

    const PORT = process.env.PORT || 5000
    const URL = "localhost"

    mongoose.connect(process.env.CONNECTION_URL)
        .then(() => app.listen(PORT, () => console.log(`Server are running on ${URL}: ${PORT} 🚀`)))
        .catch(err => console.error(err))
}

run()
