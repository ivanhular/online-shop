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
        type: mongoose.SchemaTypes.Mixed,
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
            product_name: {
                type: String,
                required: true
            },
            variation: {
                type: String,
                required: true
            },
            thumbnail: {
                type: String,
                required: true
            },
            price: {
                type: mongoose.SchemaTypes.Mixed
            },
            discount: {
                type: mongoose.SchemaTypes.Mixed
            },
            quantity: {
                type: mongoose.SchemaTypes.Mixed,
                default: 1
            }
        }
    ],
    message: {
        type: String
    }
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
// status - Pending / on review / ready(approved) / Purchased / Completedn


//add order button
//POST /orders
//add to cart if no orders yet create order for new transaction (status:Pending)
//if order exist and status pending add to existing order (status:Pending)


//Send for review Button
//PATCH /orders/:id ----- update status on review
//user send for review (status:on review)


//admin
//Items and quantity will verified by administrator for approval
//PATCH /orders/:id ----- update status approved
//if approved send the approved orders to client change status to (status:approved)

//Place Order button
//then user will place order client will send data with subtotal or Order Total (status:To shipped)
//Enter message
//Subtotal


//Payment Method ? 