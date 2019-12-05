const mongoose = require('mongoose')
const validator = require('validator')
const tinify = require("tinify")
const fs = require('fs')

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

productSchema.methods.optimizedImage = async (photos) => {

    //Get all req.files
    // const optimizedImage = photos.map(photo => {
    //     return tinify.fromBuffer(photo.buffer).toBuffer().then((data) => {
    //         return data
    //     }).catch((e) => {
    //         throw e
    //     })
    // })

    //Get array of promise using Promise.all and return array of buffer data 
    // return Promise.all(optimizedImage).then((data) => {
    //     return data
    // })


    //Get single buffer(Refactored to single call per image buffer)
    const optimizedImage = tinify.fromBuffer(photos).toBuffer()

    try {
        const data = await optimizedImage
        return data
    }
    catch (e) {
        throw e
    }

}

const Product = mongoose.model('Product', productSchema)


module.exports = Product