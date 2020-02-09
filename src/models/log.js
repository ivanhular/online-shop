const mongoose = require('mongoose')




const logSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        reuired: true
    },
    logs: [
        {
            log_name: {
                type: String
            },
            log_data: {
                type: String
            },
            createdAt: {
                type: Date
            },
            updatedAt: {
                type: Date
            }
        }
    ]


})


const Log = mongoose.model('Log', logSchema)


module.exports = Log