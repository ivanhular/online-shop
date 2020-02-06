const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    segment_id: [{
        segment_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Segment',
            required: true
        }
    }],
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

categorySchema.methods.toJSON = function () {

    const category = this

    categoryObject = category.toObject()

    if (categoryObject.photos) {
        categoryObject.photos.forEach(photo => {

            delete photo.photo

        })
    }

    return categoryObject

}

//Validate ObjectId and return data by objectID
categorySchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Category.findById(_id) : ""


const Category = mongoose.model('Category', categorySchema)

module.exports = Category