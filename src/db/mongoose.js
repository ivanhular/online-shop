const mongoose = require('mongoose')

const dbConnectionStr = process.env.NODE_ENV === 'production' ? process.env.MONGODB_CONNECTION_URL : 'mongodb://localhost:27017/owkii-db'

mongoose.connect(dbConnectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true // use easily access the data when mongoose connected to mongodb
})