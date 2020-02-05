const router = require('express').Router()
const mongoose = require('mongoose')
const Wish = require('../models/wish')
const { auth } = require('../middleware/auth')


router.post('/wishlist', auth, async (req, res) => {
    try {


        let wishlist = await Wish.findOne({ user_id: req.user._id })

        if (!wishlist) {

            const wish = new Wish({
                ...req.body,
                user_id: req.user._id
            })

            await wish.save()

            return res.status(201).send(wish)

        } else {

            wishlist.products = wishlist.products.concat(req.body.products)

            await wishlist.save()

            return res.send(wishlist)
        }

    } catch (e) {

        res.status(500).send({ message: e.message })
    }
})

router.get('/wishlist', auth, async (req, res) => {
    try {

        const wishlist = await Wish.findOne({ user_id: req.user._id })

        if (!wishlist) {
            return res.send({ message: 'No wish list' })
        }

        res.send(wishlist)

    } catch (e) {

        res.status(500).send({ message: e.message })

    }
})

router.delete('/wishlist', auth, async (req, res) => {

    try {

        const wishlist = await Wish.findOne({ user_id: req.user._id })

        if (!wishlist) {
            return res.send({ message: 'No wish list' })
        }

        if (!req.body.product_id) {
            return res.status(400).send({ message: 'Key product_id required!' })
        }

        wishlist.products = wishlist.products.filter(product => product._id != req.body.product_id)

        await wishlist.save()

        res.send(wishlist)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }

})

router.delete('/wishlist/all', auth, async (req, res) => {

    try {

        const wishlist = await Wish.findOneAndDelete({ user_id: req.user._id })

        if (!wishlist) {
            return res.status(404).send({ message: 'No Wishlist found' })
        }

        res.send({ message: 'Successfully deleted', wishlist })

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})


module.exports = router