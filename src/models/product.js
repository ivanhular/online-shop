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

productSchema.methods.optimizedImage = async (photoBuffer) => {

    //Get single buffer(Refactored to single call per image buffer) - Tinyfy working state 7.52s
    // const optimizedImage = new Promise((resolve, reject) => {
    //     tinify.fromBuffer(photoBuffer).toBuffer(async (err, data) => {

    //         if (err) {
    //             reject(err)
    //         }

    //         resolve(data)

    //     })
    // })

    // const dataImage = await optimizedImage

    // return dataImage


    const imageBuffer = await sharp(photoBuffer)
        .resize(250,250)
        .jpeg()
        .toBuffer()

    return imageBuffer

}

const Product = mongoose.model('Product', productSchema)


module.exports = Product