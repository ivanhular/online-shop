const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/online-shop', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true // use easily access the data when mongoose connected to mongodb
})


