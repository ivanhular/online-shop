const router = require('express').Router()
const mongoose = require('mongoose')
const Product = require('../models/product')
const Category = require('../models/category')
const Segment = require('../models/segment')
const Wish = require('../models/wish')
const Log = require('../models/log')
const { auth, isAdmin, getUserIfAuth } = require('../middleware/auth')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')


//CREATE product
router.post('/products', [auth, isAdmin], upload.array('photos', 12), async (req, res) => {

    const product = new Product(req.body)

    try {

        await saveOptimizedImage(product, req)
        // console.log(req.body.variations)

        if (req.body.price_options) {

            product.price_options = JSON.parse(req.body.price_options)

        }

        await product.save()

        res.status(201).send({ message: 'Product Successfully created', product })

    } catch (e) {

        res.status(400).send({ message: e.message })

    }
}, (error, req, res, next) => {
    res.status(400).send({ message: error.message }) // handle the error of multer
})


//Serve  image
router.get('/products/:id/:photo', async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)

        if (!product) {
            throw new Error('No photo found')
        }

        const photo = product.photos.find((photo) => photo.name === req.params.photo)

        if (!photo) {
            throw new Error('No photo found')
        }

        res.set('Content-type', photo.mimetype)

        res.send(photo.photo)
        // console.log()

    } catch (e) {
        res.status(404).send({ message: e.message })
    }

})

// GET /products?status=true
// GET /products?sortBy=createdAt:desc
// GET /products?segmentid=id&categoryid=id
// GET /products?segmentid=5e10a077ebe80d2e50fe2849&categoryid=5e1ee608d209a806b8fe20c4&sortByDate=createdAt:desc&sortByPrice=desc&limit=0&skip=1&featured=true
// GET products 
router.get('/products', getUserIfAuth, async (req, res) => {

    const match = {}
    const limit = {
        limit: 20
    }
    const sort = {
        createdAt: -1
    }
    const skip = {}

    try {
        // console.log(mongoose.Types.ObjectId.isValid(req.query.segmentid))

        if (req.query.limit) {
            limit.limit = parseInt(req.query.limit)
        }

        if (req.query.skip) {
            skip.skip = parseInt(req.query.skip)
        }

        // if (req.query.sortByDate) {
        //     const parts = req.query.sortByDate.split(":")
        //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        // }

        if (req.query.status) {
            match.status = req.query.status
        }

        if (req.query.segmentid) {
            if (!mongoose.Types.ObjectId.isValid(req.query.segmentid)) {
                return res.status(404).send({ message: 'No match product for this segment' })
            }
            match.segment_id = req.query.segmentid
        }

        if (req.query.categoryid) {
            if (!mongoose.Types.ObjectId.isValid(req.query.categoryid)) {
                return res.status(404).send({ message: 'No match product for this category' })
            }
            match.category_id = req.query.categoryid
        }

        if (req.query.search) {

            match.$text = {
                $search: `"${req.query.search}"`
            }

        }

        const products = await Product.find(match, null, {
            limit: limit.limit,
            skip: skip.skip,
        })

        if (req.user) {
            const wishList = await Wish.findOne({ user_id: req.user._id })
            if (wishList.products.length > 0) {
                wishList.products.forEach(wish => {
                    products.find(product => {
                        if (product._id.toString() == wish.product_id.toString()) {
                            console.log(product)
                        }
                        
                    })

                })
            }
        }

        if (req.query.sortByDate) {
            const order = req.query.sortByDate

            if (order === 'desc') {
                return res.send(products.sort((a, b) => b.createdAt - a.createdAt))
            }

            return res.send(products.sort((a, b) => a.createdAt - b.createdAt))
        }

        if (req.query.sortByPrice) {

            const order = req.query.sortByPrice

            if (order === 'desc') {
                return res.send(products.sort((a, b) => b.price_options[0].options[0].price - a.price_options[0].options[0].price))
            }

            return res.send(products.sort((a, b) => a.price_options[0].options[0].price - b.price_options[0].options[0].price))

        }

        res.send(products)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//GET product by ID
router.get('/products/:id', async (req, res) => {

    const product = await Product.isValidID(req.params.id)

    try {

        if (!product) {
            return res.status(404).send({ message: 'No product found' })
        }

        res.send(product)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }

})

//Product Search
router.post('/products/search', getUserIfAuth, async (req, res) => {
    try {

        if (!req.body.search) {
            return res.status(404).send({ message: 'Enter Search Keyword' })
        }


        if (req.user) {

            const date = new Date()

            const userLog = await Log.findOne({ user_id: req.user._id })

            if (!userLog) {

                const log = new Log({
                    user_id: req.user._id,
                    logs: [{
                        log_name: 'search',
                        log_data: req.body.search,
                        createdAt: date.getTime()
                    }]
                })

                await log.save()

            } else {

                userLog.logs = userLog.logs.concat({
                    log_name: 'search',
                    log_data: req.body.search,
                    createdAt: date.getTime()
                })

                await userLog.save()

            }

        }


        const searchResult = await Product.find({
            $text: {
                $search: `"^${req.body.search}"`
            }
        }, null, {
            limit: 20
        })
        // // .explain('executionStats')
        // console.log(searchResult)

        if (searchResult.length === 0) {
            return res.send({ message: 'No result Found' })
        }

        res.send(searchResult)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//Search Hint
router.post('/products/search/hint', async (req, res) => {
    try {

        if (!req.body.search) {
            return res.status(404).send({ message: 'Enter Search Keyword' })
        }

        const regex = new RegExp(req.body.search, 'i')

        const searchResult = await Product.find({

            product_name: regex

        }, 'product_name', {
            limit: 20
        })


        if (searchResult.length === 0) {
            return res.send({ message: 'No result Found' })
        }

        res.send(searchResult)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//Recent Search
router.post('/products/search/recent', getUserIfAuth, async (req, res) => {

    try {

        if (req.user) {

            const userLog = await Log.find({ user_id: req.user._id, 'logs.log_name': 'search' })

            if (!userLog) {
                return res.send({ message: 'No recent Search' })
            }

            const allSortedLogs = userLog[0].logs.sort((a, b) => b.createdAt - a.createdAt)

            let recentSearchLog = []

            allSortedLogs.forEach((search, i) => {
                if (!recentSearchLog.includes(search.log_data)) {
                    recentSearchLog.push(search.log_data)
                }
            })

            return res.send({ recentSearchLog })

        }

        return res.send({ message: 'User not registered' })

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//PATCH product by ID
router.patch('/products/:id', [auth, isAdmin], upload.array('photos', 12), async (req, res) => {

    const product = await Product.isValidID(req.params.id)
    const allowedUpdates = getObjectProps(Product.schema.paths)
    const updates = getObjectProps(req.body)
    const isAllowedUpdate = updates.every(update => allowedUpdates.includes(update))
    const filterInvalidUpdate = updates.filter((key) => !allowedUpdates.includes(key))

    // console.log(Object.keys(req.body))


    // console.log(req.headers)

    try {
        if (!product) {
            return res.status(404).send({ message: 'No product found' })
        }

        if (!isAllowedUpdate) {
            return res.status(400).send({ message: `Invalid field/s: ${filterInvalidUpdate.join(', ')}` })
        }


        await saveOptimizedImage(product, req)


        getObjectProps(req.body).forEach(update => {

            if (update == "price_options") {
                product[update] = JSON.parse(req.body.price_options)
            }

            product[update] = req.body[update]
        })

        if (req.body.price_options) {

            product.price_options = JSON.parse(req.body.price_options)

        }

        await product.save()

        res.send(product)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }

})



//DELETE product by ID 
router.delete('/products/:id', [auth, isAdmin], async (req, res) => {

    const product = await Product.isValidID(req.params.id)

    try {

        if (!product) {
            res.status(404).send()
        }

        await product.remove()

        res.send(product)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})



module.exports = router