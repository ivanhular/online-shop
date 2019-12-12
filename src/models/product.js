const mongoose = require('mongoose')
const validator = require('validator')
const tinify = require("tinify")
const fs = require('fs')
const sharp = require('sharp')

tinify.key = process.env.TINIFY_KEY

// product_name
// category_id
// product_descriptions
// supplier_price
// product_price
// markup(%)
// discount( !< markup %)
// weight
// photos[]
// supplier
// status

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    product_descriptions: {
        type: String,
        trim: true
    },
    supplier_name: {
        type: String,
        trim: true
    },
    supplier_price: {
        type: Number,
        // validate(val) {
        //     if (!validator.isDecimal(val)) {
        //         throw new Error('invalid Supplier price!')
        //     }
        // }
    },
    product_price: {
        type: Number,
        required: true,
        // validate(val) {
        //     if (!validator.isDecimal(val)) {
        //         throw new Error('invalid Product price!')
        //     }
        // }
    },
    markup: {
        type: Number,
        required: true,
        // validate(val) {
        //     if (!validator.isNumeric(val)) {
        //         throw new Error('invalid Markup!')
        //     }
        // }
    },
    discount: {
        type: Number,
        required: true,
        // validate(val) {
        //     if (!validator.isNumeric(val)) {
        //         throw new Error('invalid Discount!')
        //     }
        // }
    },
    weight: {
        type: Number,
        required: true,
        // validate(val) {
        //     if (!validator.isNumeric(val)) {
        //         throw new Error('invalid Weight!')
        //     }
        // }
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
    ],
    status: {
        type: Boolean,
        default: false
    }


})

productSchema.methods.toJSON = function () {
    const product = this

    productObject = product.toObject()

    // delete productObject.photos.photo

    productObject.photos.forEach(photo => {
        delete photo.photo
    })

    // console.log(productObject.photos)

    return productObject

}

productSchema.methods.saveOptimizedImage = async function (files) {

    const product = this

    const photos = files.map(async (photo) => {

        // const optimizedImage = await product.optimizedImage(photo.buffer)

        const imageBuffer = await sharp(photo.buffer)
        .resize(250, 250)
        .jpeg()
        .toBuffer()

        return {
            // photo: photo.buffer,
            photo: imageBuffer,
            name: photo.originalname
        }

    })

    const dataImage = await Promise.all(photos) // Promise.all return new promises

    // console.log(dataImage)

    product.photos = dataImage
}

//Validate ObjectId
productSchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ?  await Product.findById(_id) : ""


const Product = mongoose.model('Product', productSchema)


module.exports = Product