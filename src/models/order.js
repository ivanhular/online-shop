const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    chat_id: {
        type: mongoose.Types.ObjectId,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
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
                ref: 'Product'
            },
            price: {
                type: Number
            },
            discount: {
                type: Number
            },
            quantity: {
                type: Number,
                default: 1
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
//status - Pending / on review / ready(approved) / Purchased / Completed


//add to cart if no orders yet create order for new transaction (status:Pending)
//if order exist and status pending add to existing order (status:Pending)
//user send for review (status:on review)
//Items and quantity will verified by administrator for approval
//if approved send the approved orders to client changed to (status:approved)
//then user will place order client will send data with subtotal or Order Total (status:To shipped)


//Payment Method ? 