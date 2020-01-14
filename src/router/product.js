const router = require('express').Router()
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

        console.log(product)

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
// GET /products?category=shoes
// GET /products?segment=kids
// GET /products?sortBy=createdAt:desc
//GET products 
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({})
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