const mongoose = require('mongoose')
//mongodb://localhost:27017/online-shop
mongoose.connect(process.env.MONGODB_CONNECTION_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true // use easily access the data when mongoose connected to mongodb
})


