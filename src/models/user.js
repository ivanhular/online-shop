const mongoose = require('mongoose')
const bcrpyt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

// const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate:{
            validator:function(v){
                return validator.isEmail(v)
            },
            message: props => `Invalid Email`
        }
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Invalid Email')
        //     }
        // }
    },
    password: {
        type: String,
        minlength: [6,'Password minimun of 6 characters'],
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Contains word password')
            }
        }
    },
    role: {
        type: String,
        trim: true
    },
    delivery_address: {
        type: String,
        trim: true
    },
    delivery_name: {
        type: String,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true //set Schema Model options
});

//Returned Response
userSchema.methods.toJSON = function () {
    const user = this

    try {
        const userObject = user.toObject()

        delete userObject.tokens

        return userObject

    } catch (e) {

        return e.message
    }

}

//Login by credentials
userSchema.statics.findByCredentials = async (email, password) => {

    try {
        const user = await User.findOne({ email })

        if (!user) {
            throw Error()
        }

        const isMatch = await bcrpyt.compare(password, user.password)

        if (!isMatch) {
            throw Error()
        }

        return user

    } catch (e) {

        throw new Error('Invalid Login!')
    }


}

//Generate Auth Token 
userSchema.methods.generateAuthToken = async function () {

    const user = this

    try {

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)

        user.tokens = user.tokens.concat({ token })

        user.save()

        return token

    } catch (e) {

        return e.message
    }

}

//Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrpyt.hash(user.password, 8)
    }
    next()
})

//Validate ObjectId
userSchema.statics.isValidID = async (_id) => mongoose.Types.ObjectId.isValid(_id) || false


const User = mongoose.model('User', userSchema)


module.exports = User