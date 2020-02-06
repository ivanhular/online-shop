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

        res.send({ message: 'Category created.', category })

    } catch (e) {

        res.status(500).send({ message: e.message })

    }


})

//GET
router.get('/categories', async (req, res) => {
    try {

        const category = await Category.find()

        res.send(category)

    } catch (e) {

        res.status(500).send({ message: e.message })
    }

})

//Serve category Image/s
router.get('/categories/:id/:photo', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            throw new Error('No photo found')
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
        const updates = getObjectProps(req.body)
        const isValidUpdate = updates.every(update => allowedUpdates.includes(update))
        const filterInvalidUpdate = updates.filter((key) => !allowedUpdates.includes(key))

        if (!category) {
            return res.status(404).send({ message: 'No category found' })
        }

        if (!isValidUpdate) {
            return res.status(400).send({ message: `Invalid field/s: ${filterInvalidUpdate.join(', ')}` })
        }

        await saveOptimizedImage(category, req.files)

        getObjectProps(req.body).forEach(update => {
            category[update] = req.body[update]
        })

        category.segment_id = JSON.parse(req.body.segment_id)

        await category.save()

        res.send({ message: 'Category Updated.', category })

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//DELETE
router.delete('/categories/:id', [auth, isAdmin], async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)

        res.send({ message: 'Category Deleted!', category })

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})


module.exports = router