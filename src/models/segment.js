const mongoose = require('mongoose')

const segmentSchema = new mongoose.Schema({
    segment_name: {
        type: String,
        unique:true,
        required: true,
        lowercase:true,
        trim:true
    },
    photos: [
        {
            photo: {
                type: Buffer,
            },
            name: {
                type: String,
                required: true
            },
            featured: {
                type: Boolean,
                default: false
            }
        }
    ]
})

segmentSchema.methods.toJSON = function () {

    const segment = this

    segmentObject = segment.toObject()

    segmentObject.photos.forEach(photo => {

        delete photo.photo

    })


    return segmentObject

}
//Validate ObjectId
segmentSchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Segment.findById(_id) : ""

const Segment = mongoose.model('Segment', segmentSchema)

module.exports = Segment