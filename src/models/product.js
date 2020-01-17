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
        type: Number,
        required: true
    },
    markup: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
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
            }
        }
    ],
    variations: [
        {
            priceOption: [
                {
                    options: [
                        {
                            option: {
                                type: String,
                                required: true
                            },
                            price: {
                                type: Number,
                                required: true
                            },
                            old_price: {
                                type: Number,
                                required: true
                            }
                        }

                    ]

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

    productObject = product.toObject()

    // delete productObject.photos.photo

    productObject.photos.forEach(photo => {
        delete photo.photo
    })

    // console.log(productObject.photos)

    return productObject

}


//Validate ObjectId
productSchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) ? await Product.findById(_id) : ""


const Product = mongoose.model('Product', productSchema)


module.exports = Product



// [
//     {
//         "priceOptions": [
//             {
//                 "variation": "Red",
//                 "options": [
//                     {
//                         "option": "sm",
//                         "price": 200,
//                         "old_price": 100
//                     }

//                 ]
//             }
//         ]
//     }

// ]