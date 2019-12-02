const router = require('express').Router()
const Product = require('../models/product')
const multer = require('multer')
const tinify = require("tinify")

tinify.key = process.env.TINIFY_KEY

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

        req.files.forEach((photo) => {
            product.photos.push({
                photo: photo.buffer,
                name: photo.originalname
            })
        })

        console.log(product)
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



module.exports = router