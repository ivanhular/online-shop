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
    isAdmin
}