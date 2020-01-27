const mongoose = require('mongoose')
    //mongodb://localhost:27017/online-shop
mongoose.connect('mongodb://localhost:27017/owkii-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true // use easily access the data when mongoose connected to mongodb
})