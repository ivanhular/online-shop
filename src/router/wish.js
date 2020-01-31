const router = require('express').Router()
const Wish = require('../models/order')
const { auth } = require('../middleware/auth')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')


router.post('/wishlist', auth, async (req, res) => {
    try {

        const wish = new Wish(req.body)

        await wish.save()

        res.send(wish)

    } catch (e) {

        res.status(500).send(e)
    }
})



module.exports = router