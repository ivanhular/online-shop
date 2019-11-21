const express = require('express')

const port = process.env.PORT || 5000

const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.send({name:'test'})
})

app.listen(port, () => {
    console.log(`App running on Port ${port}`)
})