const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')

const port = process.env.PORT || 4000

const app = express()
app.use(express.json())
app.use(userRouter)



app.listen(port, () => {
    console.log(`App running on Port ${port}`)
})