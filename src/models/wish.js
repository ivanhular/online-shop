const mongoose = require('mongoose')
const Product = require('../models/product')


const wishSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [
        {
            product_id: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            price: {
                type: Number
            },
            discount: {
                type: Number
            },
            quantity: {
                type: Number
            },
            thumbnail: {
                type: String,
                required: true
            }
        }
    ]
})

wishSchema.pre('save', async function (next) {

    const wishlist = this

    try {

        const thumbnail = await Product.findById(this)

        // wishlist.thumbnail = wi

        next()

    } catch (e) {

        return e.message

    }




})

const Wish = mongoose.model('Wish', wishSchema)


module.exports = Wish

// user_id
// chat_id
// transaction_id
// total
// net_income
// PRODUCTS = [{}]
// product_id
// price
// discount
// quantity
//status - Pending / on review / ready / Purchased / Completed
