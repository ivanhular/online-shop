const router = require('express').Router()
const mongoose = require('mongoose')
const Product = require('../models/product')
const Category = require('../models/category')
const Segment = require('../models/segment')
const { auth, isAdmin } = require('../middleware/auth')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')


//CREATE product
router.post('/products', [auth, isAdmin], upload.array('photos', 12), async (req, res) => {

    const product = new Product(req.body)

    try {

        await saveOptimizedImage(product, req.files)
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
// GET /products?segmentid=5e10a077ebe80d2e50fe2849&categoryid=5e1ee608d209a806b8fe20c4&sortBy=createdAt:desc&limit=0&skip=1&featured=true
// GET products 
router.get('/products', async (req, res) => {

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

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        if (req.query.status) {
            match.status = req.query.status
        }

        if (req.query.segmentid) {
            if (!mongoose.Types.ObjectId.isValid(req.query.segmentid)) {
                return res.status(404).send()
            }
            match.segment_id = req.query.segmentid
        }


        if (req.query.categoryid) {
            if (!mongoose.Types.ObjectId.isValid(req.query.categoryid)) {
                return res.status(404).send()
            }
            match.category_id = req.query.categoryid
        }


        const products = await Product.find(match, null, {
            limit: limit.limit,
            skip: skip.skip,
            sort
        })

        res.send(products)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//GET product by ID
router.get('/products/:id', auth, async (req, res) => {

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
router.post('/products/search', auth, async (req, res) => {
    try {

        if (!req.body.search) {
            return res.status(404).send({ message: 'Enter Search Keyword' })
        }

        const searchResult = await Product.find({
            $text: {
                $search: `"${req.body.search}"`
            }
        }, 'product_name', {
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

//Hint
router.post('/products/search/hint', auth, async (req, res) => {
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
        // // .explain('executionStats')
        // console.log(searchResult)
        res.send(searchResult)

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