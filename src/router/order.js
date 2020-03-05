const router = require('express').Router()
const Wish = require('../models/wish')
const Order = require('../models/order')
const { auth } = require('../middleware/auth')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')

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

router.post('/orders', auth, async (req, res) => {
    try {

        const order = Order.findOne({ user_id: req.user._id })
        // const order = await Order.find({ user_id: req.user._id }, null, {
        //     sort: {
        //         createdAt: -1
        //     }
        // })

        if (!order) {

            const newOrder = new Order({
                ...req.body,
                user_id: req.user._id
            })

            await newOrder.save()

            return res.send({ message: 'Order Added successfully' })
        }

        if (order.status === 'pending') {

            order.products = order.products.concat(req.body.products)

            await order.save()

            return res.send({ message: 'Order updated.' })
        }

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

router.get('/orders', auth, async (req, res) => {
    try {
        const order = await Order.find({ user_id: req.user._id })

        if (!order) {
            return res.status(404).send({ message: 'No Orders yet.' })
        }
        // console.log(order)

        res.send({ transactions: order })

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

module.exports = router