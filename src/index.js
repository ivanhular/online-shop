const express = require('express')
// const session = require('express-session');
require('./db/mongoose')
const userRouter = require('./router/user')
const productRouter = require('./router/product')
const segmentRouter = require('./router/segment')
const categoryRouter = require('./router/category')

const port = process.env.PORT || 5000

const app = express()
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
//   }))
app.use(express.json())
app.use(userRouter)
app.use(categoryRouter)
app.use(segmentRouter)
app.use(productRouter)



app.listen(port, () => {
    console.log(`App running on Port ${port}`)
})