const mongoose = require('mongoose')

const segmentSchema = new mongoose.Schema({
    segment_name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
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
            mimetype: {
                type: String,
                required: true
            },
            featured: {
                type: Boolean,
                default: false
            },
            url: {
                type: String
            }
        }
    ]
})

segmentSchema.virtual('categoriesBysegment', {
    ref: 'Category', //Model name to reference
    localField: '_id', //local identifier
    foreignField: 'segment_id.segment_id' // foreign key from the relationed model
})


segmentSchema.methods.toJSON = function () {

    const segment = this

    const domain = process.env.NODE_ENV === 'production' ? process.env.DOMAIN : `localhost:${process.env.PORT}`

    segmentObject = segment.toObject()

    segmentObject.photos.forEach(photo => {

        photo.url = `${domain}${photo.url}`

        delete photo.photo

    })


    return segmentObject

}
//Validate ObjectId
segmentSchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Segment.findById(_id) : ""

const Segment = mongoose.model('Segment', segmentSchema)

module.exports = Segment