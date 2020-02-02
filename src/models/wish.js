const mongoose = require('mongoose')


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
            }
        }
    ]
})

// wishSchema.methods = function () {
//     const wish = this

//     try {

//         const wishObject = wish.toObject()

//         return wishObject

//     } catch (e) {

//         return e
//     }
// }
// wishSchema.pre('save', async function (next) {

//     const wishlist = this 



//     next()
// })

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
