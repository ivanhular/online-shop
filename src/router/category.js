const router = require('express').Router()
const Category = require('../models/category')
const { auth, isAdmin } = require('../middleware/auth')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')


//Create Category
router.post('/categories', [auth, isAdmin], upload.array('photos', 12), async (req, res) => {

    const category = new Category(req.body)

    try {

        await saveOptimizedImage(category, req.files)

        category.segment_id = JSON.parse(req.body.segment_id)

        await category.save()

        res.send(category)

    } catch (e) {

        res.status(500).send({ message: e.message })

    }


})

//GET
router.get('/categories', [auth], async (req, res) => {
    try {

        const category = await Category.find()

        res.send(category)

    } catch (e) {

        res.status(500).send({ message: e.message })
    }

})

//Serve category Image/s
router.get('/categories/:id/:photo', [auth], async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            throw new Error()
        }

        const photo = category.photos.find(photo => photo.name === req.params.photo)

        res.set('content-type', photo.mimetype)

        res.send(photo.photo)


    } catch (e) {
        res.status(404).send({ message: e.message })
    }
})

//PATCH
router.patch('/categories/:id', [auth, isAdmin], upload.array('photos', 12), async (req, res) => {
    try {

        const category = await Category.isValidID(req.params.id)
        const allowedUpdates = getObjectProps(Category.schema.paths)
        const isValidUpdate = getObjectProps(req.body).every(update => allowedUpdates.includes(update))

        if (!category) {
            return res.status(404).send()
        }

        if (!isValidUpdate) {
            return res.status(400).send()
        }

        await saveOptimizedImage(category, req.files)

        getObjectProps(req.body).forEach(update => {
            category[update] = req.body[update]
        })

        category.segment_id = JSON.parse(req.body.segment_id)

        await category.save()

        res.send(category)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//DELETE
router.delete('/categories/:id', [auth, isAdmin], async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)

        res.send(category)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})


module.exports = router