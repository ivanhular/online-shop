const router = require('express').Router()
const Product = require('../models/product')
const multer = require('multer')




const upload = multer({
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('Please Upload Image Only!'))
        }
        cb(undefined, true)
    }
})

//CREATE product
router.post('/products', upload.array('photos', 12), async (req, res) => {
    try {
        const product = new Product(req.body)

        const photos = req.files.map(async (photo) => {

            const optimizedImage = await product.optimizedImage(photo.buffer)

            // console.log(optimizedImage)
            // console.log('pushed')

            return {
                // photo: photo.buffer,
                photo: optimizedImage,
                name: photo.originalname
            }

        })

        const dataImage = await Promise.all(photos) // Promise.all return new promises

        product.photos = dataImage

        await product.save()

        res.status(201).send()

    } catch (e) {

        res.status(400).send(e)

    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message }) // handle the error of multer
})

//Serve product image
router.get('/products/:id/:photo', async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)

        if (!product) {
            throw new Error()
        }

        res.set('Content-type', 'image/jpeg')

        const photo = product.photos.find((photo) => photo.name === req.params.photo)

        res.send(photo.photo)
        // console.log()

    } catch (e) {
        res.status(404).send()
    }

})


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

    const product = await Product.isValidID(req.params.id) ? await Product.findById(req.params.id) : ""

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
router.patch('/products/:id', async (req, res) => {

    const product = await Product.findById(req.params.id)

    try {
        if (!product) {
            return res.status(404).send()
        }
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }

})


module.exports = router