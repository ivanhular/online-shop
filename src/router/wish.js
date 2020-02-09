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

            return res.status(201).send({ message: 'Added to wishlist', wish })

        } else {

            const { products } = req.body //get all request products

            //check if theres some existing product on the list
            products.forEach(reqProduct => {

                const isListed = wishlist.products.find(listedProduct => listedProduct.product_id == reqProduct.product_id)

                //if not listed add to wishlist
                if (!isListed) {
                    wishlist.products = wishlist.products.concat(reqProduct)
                }
            })

            await wishlist.save()

            return res.send({ message: 'Added to wishlist', wishlist })
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

        res.send({ wishlist })

    } catch (e) {

        res.status(500).send({ message: e.message })

    }
})

//Delete by product item ID from list
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

        res.send({ message: 'Wishlist deleted', wishlist })

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

        res.send({ message: 'All wish deleted', wishlist })

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})


module.exports = router