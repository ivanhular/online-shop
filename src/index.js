const express = require('express')
const User = require('./models/user')

const port = process.env.PORT || 5000

const app = express()
app.use(express.json())



app.post('/users', async (req, res) => {

    // console.log(user)
    const user = await new User(req.body)

    await user.save()
    
    res.send(user)
})

app.listen(port, () => {
    console.log(`App running on Port ${port}`)
})