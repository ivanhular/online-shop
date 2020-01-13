const router = require('express').Router()
const Category = require('../models/category')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')


//Create Category
router.post('/categories', upload.array('photos', 12), async (req, res) => {

    const category = new Category(req.body)

    try {

        await saveOptimizedImage(category, req.files)

        await category.save()

        res.send(category)

    } catch (e) {

        res.send(e)

    }


})

//GET
router.get('/categories', async (req, res) => {
    try {

        const category = await Category.find()

        res.send(category)

    } catch (e) {

        res.status(500).send(e)
    }

})

//Serve category Image/s
router.get('/categories/:id/:photo', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            throw new Error()
        }

        const photo = category.photos.find(photo => photo.name === req.params.photo)

        res.set('content-type', 'image/jpeg')

        res.send(photo.photo)


    } catch (e) {
        res.status(404).send(e)
    }
})

//PATCH
router.patch('/categories/:id', async (req, res) => {
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

        getObjectProps(req.body).forEach(update => {
            category[update] = req.body[update]
        })

        await category.save()
        // console.log(req.params.id)
        res.send(category)

    } catch (e) {
        res.send(e)
    }
})

//DELETE
router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)

        res.send(category)

    } catch (e) {
        res.send(e)
    }
})


module.exports = router