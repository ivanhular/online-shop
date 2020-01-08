const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        unique:true,
        required: true,
        lowercase:true,
        trim:true
    }
})

//Validate ObjectId
categorySchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Category.findById(_id) : ""


const Category = mongoose.model('Category', categorySchema)

module.exports = Category