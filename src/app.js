require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const barangRouter = require('./routers/barang')
const transaksiRouter = require('./routers/transaksi')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const prefill_user = require('./functions/prefill_user')
const hbs = require('hbs')
const path = require("path");
const methodOverride = require('method-override')

const viewsPath = path.join(__dirname, '../templates/views')
const vartialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')

const app = express()


app.use(express.static(publicDirectoryPath))

app.set('views', viewsPath)
app.set('view engine', 'hbs')
hbs.registerPartials(vartialsPath)

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
        maxAge: 1800000,
        sameSite: 'lax'
    },
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
}));
app.use(flash())

prefill_user.prefill_user()
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(userRouter)
app.use(barangRouter)
app.use(transaksiRouter)

module.exports = app

//to be implemented later
//compression already implemented in production