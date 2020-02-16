const mongoose = require('mongoose')
const validator = require('validator')
const fs = require('fs')


const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    featured: {
        type: Boolean
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    segment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segment'
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
        type: Number
    },
    product_price: {
        type: Number
    },
    markup: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    photos: [{
        photo: {
            type: Buffer,
        },
        name: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
        },
        featured: {
            type: Boolean,
            default: false
        },
        url: {
            type: String
        }
    }],
    price_options: [
        {
            variation_name: {
                type: String,
                required: true
            },
            options: [
                {
                    option_name: {
                        type: String,
                        required: true
                    },
                    price: {
                        type: mongoose.SchemaTypes.Decimal128,
                        required: true
                    }
                }
            ]

        }
    ],
    status: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true //set Schema Model options
})

productSchema.methods.toJSON = function () {

    const product = this

    try {

        const domain = process.env.NODE_ENV === 'production' ? process.env.DOMAIN : `localhost:${process.env.PORT}`

        productObject = product.toObject()

        // delete productObject.photos.photo
        delete productObject.markup
        delete productObject.discount

        if (productObject.photos) {
            productObject.photos.forEach(photo => {
                photo.url = `${domain}${photo.url}`
                delete photo.photo
            })
        }

        return productObject


    } catch (e) {

        return e

    }


    // console.log(productObject.photos)


}

productSchema.index({ product_name: 'text' })

//Validate ObjectId
productSchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Product.findById(_id) : ""


const Product = mongoose.model('Product', productSchema)


module.exports = Product

