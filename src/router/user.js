const User = require('../models/user')
const express = require('express')
const { auth, isAdmin } = require('../middleware/auth')
const { getObjectProps } = require('../utils/utils')

const router = express.Router()

//POST Users
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    // console.log(req.header('Authorization'))

    try {

        await user.save()

        const token = await user.generateAuthToken()

        return res.status(201).send({ user, token })

    } catch (e) {
        res.status(400).send({ error: e })
    }

})

//GET all users
router.get('/users', [auth, isAdmin], async (req, res) => {

    const users = await User.find({})

    res.send(users)
})

//GET user by ID
router.get('/users/:id', [auth, isAdmin], async (req, res) => {

    const user = await User.isValidID(req.params.id) ? await User.findById(req.params.id) : ""

    try {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})


//UPDATE user by ID
router.patch('/users/:id', [auth, isAdmin], async (req, res) => {

    const user = await User.isValidID(req.params.id) ? await User.findById(req.params.id) : ""
    const allowedUpdates = getObjectProps(User.schema.paths)
    const updates = getObjectProps(req.body)
    const isValidUpdate = updates.every((key) => allowedUpdates.includes(key))

    console.log(isValidUpdate)

    try {
        if (!user) {
            return res.status(404).send()
        }

        if (!isValidUpdate) {
            return res.status(400).send()
        }

        updates.forEach((key) => {
            user[key] = req.body[key]
        })

        await user.save()

        res.send(user)

    } catch (e) {
        res.status(500).send(e)
    }
})


//DELETE user by ID
router.delete('/users/:id', [auth, isAdmin], async (req, res) => {
    try {
        const user = await User.isValidID(req.params.id) ? await User.findByIdAndDelete(req.params.id) : ""

        res.send(user)

    } catch (e) {
        res.status(500).send(e)
    }
})

//Login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(404).send(e)
    }
})

//Logout user
router.post('/users/logout', auth, async (req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send({ message: 'Succesfully Logout.' })

    } catch (e) {

        res.status(500).send(e)

    }
})


module.exports = router