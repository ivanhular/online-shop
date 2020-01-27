const express = require('express')
const session = require('express-session');
const uuidv1 = require('uuid/v1');
require('./db/mongoose')
const userRouter = require('./router/user')
const productRouter = require('./router/product')
const segmentRouter = require('./router/segment')
const categoryRouter = require('./router/category')


const port = process.env.PORT || 5000

const app = express()

let sess;

app.use(session({
    secret: process.env.SESSION_KEY,
    genid: function(req) {
        return uuidv1() // use UUIDs for session IDs
    },
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(express.json())
app.use(userRouter)
app.use(categoryRouter)
app.use(segmentRouter)
app.use(productRouter)

app.get('/', (req, res) => {
    sess = req.session
    req.session.token = 'testtoken'
    req.session.ID = req.sessionID
    res.send(req.session)
})
app.get('/test', (req, res) => {
    res.send(req.session.ID)
})
app.get('/destroy', (req, res) => {
    req.session.destroy()
    res.send({ message: 'logout!' })
})



app.listen(port, () => {
    console.log(`App running on Port ${port}`)
})