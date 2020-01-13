const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    category_name: {
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
            featured: {
                type: Boolean,
                default: false
            }
        }
    ]
})

categorySchema.methods.toJSON = function () {

    const category = this

    categoryObject = category.toObject()

    categoryObject.photos.forEach(photo => {

        delete photo.photo

    })


    return categoryObject

}

//Validate ObjectId
categorySchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Category.findById(_id) : ""


const Category = mongoose.model('Category', categorySchema)

module.exports = Category