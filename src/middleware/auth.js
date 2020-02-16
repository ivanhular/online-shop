const jwt = require('jsonwebtoken')
const User = require('../models/user')



const auth = async (req, res, next) => {

    // console.log(req.session)

    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        next()


    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate' })
    }
}


const getUserIfAuth = async (req, res, next) => {

    try {

        if (req.header('Authorization')) {

            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
<<<<<<< HEAD
=======

            console.log(decoded)

>>>>>>> aef0489d65cdf58b00a1e51d1c1a46b83c2d7528
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

            req.token = token
            req.user = user
<<<<<<< HEAD

=======
>>>>>>> aef0489d65cdf58b00a1e51d1c1a46b83c2d7528
        }

        next()


    } catch (e) {
        res.send({ message: e.message })
    }
}



const isAdmin = async (req, res, next) => {

    const authrizedRole = ['owner', 'admin']

    try {

        if (!req.user.role) {
            throw new Error()
        }

        if (!authrizedRole.includes(req.user.role)) {
            return res.status(403).send()
        }

        next()

    } catch (e) {
        res.status(401).send({ error: 'Unauthorized Access!' })
    }
}

module.exports = {
    auth,
    isAdmin,
    getUserIfAuth
}