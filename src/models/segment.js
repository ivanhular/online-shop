const mongoose = require('mongoose')

const segmentSchema = new mongoose.Schema({
    segment_name: {
        type: String,
        unique:true,
        required: true,
        lowercase:true,
        trim:true
    }
})

//Validate ObjectId
segmentSchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Segment.findById(_id) : ""

const Segment = mongoose.model('Segment', segmentSchema)

module.exports = Segment