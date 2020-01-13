const router = require('express').Router()
const Segment = require('../models/segment')
const { getObjectProps, upload, saveOptimizedImage } = require('../utils/utils')



//Create Segment
router.post('/segments', upload.array('photos', 12), async (req, res) => {

    const segment = new Segment(req.body)

    try {

        await saveOptimizedImage(segment, req.files)

        await segment.save()

        res.send(segment)

    } catch (e) {

        res.send(e)

    }


})

//GET
router.get('/segments', async (req, res) => {
    try {

        const segment = await Segment.find()

        res.send(segment)

    } catch (e) {

        res.status(500).send(e)
    }

})

//PATCH
router.patch('/segments/:id', async (req, res) => {
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

        getObjectProps(req.body).forEach(update => {
            segment[update] = req.body[update]
        })

        await segment.save()
        // console.log(req.params.id)
        res.send(segment)

    } catch (e) {
        res.send(e)
    }
})

//DELETE
router.delete('/segments/:id', async (req, res) => {
    try {
        const segment = await Segment.findByIdAndDelete(req.params.id)

        res.send(segment)

    } catch (e) {
        res.send(e)
    }
})


module.exports = router