const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: User
    },
    chat_id: {
        type: mongoose.Types.ObjectId,
    },
    status: {
        type: String,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    shipping_fee: {
        type: Number,
    },
    shipping_address: {
        type: String,
        trim: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: Product
            },
            price: {
                type: Number
            },
            discount: {
                type: Number
            },
            quantity: {
                type: Number
            }
        }
    ]
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

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
//status - Pending / to review / Completed
