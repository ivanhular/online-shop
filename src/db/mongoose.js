const mongoose = require('mongoose')
//mongodb://localhost:27017/online-shop

const dbConnectionStr = process.env.ENVIRONMENT === 'production' ? process.env.ENVIRONMENT : 'mongodb://localhost:27017/owkii-db'

mongoose.connect(dbConnectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true // use easily access the data when mongoose connected to mongodb
})