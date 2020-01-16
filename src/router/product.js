const router = require('express').Router()
const mongoose = require('mongoose')
const Product = require('../models/product')
const Category = require('../models/category')
const Segment = require('../models/segment')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')


//CREATE product
router.post('/products', upload.array('photos', 12), async (req, res) => {

    const product = new Product(req.body)

    try {

        await saveOptimizedImage(product, req.files)
        // console.log(req.body.variations)

        if (req.body.variations) {

            product.variations = JSON.parse(req.body.variations)

        }

        await product.save()

        res.status(201).send(product)

    } catch (e) {

        res.status(400).send(e)

    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message }) // handle the error of multer
})


//Serve  image
router.get('/products/:id/:photo', async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)

        if (!product) {
            throw new Error()
        }

        const photo = product.photos.find((photo) => photo.name === req.params.photo)

        res.set('Content-type', photo.mimetype)

        res.send(photo.photo)
        // console.log()

    } catch (e) {
        res.status(404).send()
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
        res.status(500).send(e)
    }
})

//GET product by ID
router.get('/products/:id', async (req, res) => {

    const product = await Product.isValidID(req.params.id)

    try {

        if (!product) {
            return res.status(404).send()
        }

        res.send(product)

    } catch (e) {
        res.status(500).send(e)
    }

})

//PATCH product by ID
router.patch('/products/:id', upload.array('photos', 12), async (req, res) => {

    const product = await Product.isValidID(req.params.id)

    const allowedUpdates = getObjectProps(Product.schema.paths)
    const isAllowedUpdate = getObjectProps(req.body).every(update => allowedUpdates.includes(update))

    // console.log(Object.keys(req.body))

    try {

        if (!product) {
            return res.status(404).send()
        }

        if (!isAllowedUpdate) {
            return res.status(400).send()
        }

        await saveOptimizedImage(product, req.files)

        getObjectProps(req.body).forEach(update => {
            product[update] = req.body[update]
        })

        await product.save()

        res.send(product)

    } catch (e) {
        res.status(500).send(e)
    }

})


//DELETE product by ID 
router.delete('/products/:id', async (req, res) => {

    const product = await Product.isValidID(req.params.id)

    try {

        if (!product) {
            res.status(404).send()
        }

        await product.remove()

        res.send(product)

    } catch (e) {
        res.status(500).send(e)
    }
})


//POST Segment
router.post('/products/segments', async (req, res) => {

})

module.exports = router