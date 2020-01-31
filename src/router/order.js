const router = require('express').Router()
const Order = require('../models/order')
const { auth } = require('../middleware/auth')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')


router.post('/orders', auth, async (req, res) => {
    try {

    } catch (e) {

    }
})



module.exports = router