const mongoose = require('mongoose')
const validator = require('validator')


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
        required: true,
        ref: 'Category'
    },
    product_descriptions: {
        type: String,
        trim: true
    },
    supplier_name:{
        type:String,
        trim:true
    },
    supplier_price: {
        type: Number,
        validate(val) {
            if (!validator.isDecimal(val)) {
                throw new Error('invalid Supplier price!')
            }
        }
    },
    product_price: {
        type: Number,
        required: true,
        validate(val) {
            if (!validator.isDecimal(val)) {
                throw new Error('invalid Product price!')
            }
        }
    },
    markup: {
        type: Number,
        required: true,
        validate(val) {
            if (!validator.isNumeric(val)) {
                throw new Error('invalid Markup!')
            }
        }
    },
    discount: {
        type: Number,
        required: true,
        validate(val) {
            if (!validator.isNumeric(val)) {
                throw new Error('invalid Discount!')
            }
        }
    },
    weight: {
        type: Number,
        required: true,
        validate(val) {
            if (!validator.isDecimal(val)) {
                throw new Error('invalid Weight!')
            }
        }
    },
    photos: [
        {
            photo: {
                type: Buffer,
                featured:{
                    type:Boolean,
                    default:false
                }
            }
        }
    ],
    status:{
        type:Boolean,
        default:false
    }


})

const Product = mongoose.model('Product', productSchema)


module.exports = Product