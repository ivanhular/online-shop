const router = require('express').Router()
const Segment = require('../models/segment')
const Category = require('../models/category')
const { auth, isAdmin } = require('../middleware/auth')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')



//Create Segment
router.post('/segments', [auth, isAdmin], upload.array('photos', 12), async (req, res) => {

    const segment = new Segment(req.body)

    try {

        await saveOptimizedImage(segment, req.files)

        await segment.save()

        res.send(segment)

    } catch (e) {

        res.status(500).send({ message: e.message })

    }


})

//GET
router.get('/segments', auth, async (req, res) => {
    try {

        const segment = await Segment.find()

        res.send(segment)

    } catch (e) {

        res.status(500).send({ message: e.message })
    }

})

//Serve segment Image/s
router.get('/segments/:id/:photo', auth, async (req, res) => {
    try {
        const segment = await Segment.findById(req.params.id)

        if (!segment) {
            throw new Error()
        }

        const photo = segment.photos.find(photo => photo.name === req.params.photo)

        res.set('content-type', photo.mimetype)

        res.send(photo.photo)


    } catch (e) {
        res.status(404).send({ message: e.message })
    }
})

//GET /segments/:id
router.get('/segments/:id', auth, async (req, res) => {
    try {

        const segment = await Segment.isValidID(req.params.id)

        if (!segment) {
            return res.status(404).send()
        }

        await segment.populate({
            path: 'categoriesBysegment',
            match: {
                'segment_id.segment_id': { segment_id: segment._id }
            },
            options: { //search options for filtering and pagination
                limit: 5,
                // skip: parseInt(req.query.skip),
                // sort:
                //pick a field you want to SORT BY
                //createdAt: 1 // 1-ASC -1-DESC

            }
        }).execPopulate()

        res.send(segment.categoriesBysegment)

    } catch (e) {

        res.status(500).send({ message: e.message })
    }

})

//PATCH
router.patch('/segments/:id', [auth, isAdmin], upload.array('photos', 12), async (req, res) => {
    try {

        const segment = await Segment.isValidID(req.params.id)
        const allowedUpdates = getObjectProps(Segment.schema.paths)
        const isValidUpdate = getObjectProps(req.body).every(update => allowedUpdates.includes(update))

        if (!segment) {
            return res.status(404).send()
        }
        if (!isValidUpdate) {
            return res.status(400).send()
        }

        console.log(req.body)
        await saveOptimizedImage(segment, req.files)

        getObjectProps(req.body).forEach(update => {
            segment[update] = req.body[update]
        })

        await segment.save()
        // console.log(req.params.id)
        res.send(segment)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//DELETE
router.delete('/segments/:id', [auth, isAdmin], async (req, res) => {
    try {
        const segment = await Segment.findByIdAndDelete(req.params.id)

        res.send(segment)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})


module.exports = router