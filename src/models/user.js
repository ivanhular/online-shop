const mongoose = require('mongoose')
const bcrpyt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        minlength: 6,
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
    shipping_address: {
        type: String,
        trim: true
    }
});

// email
// phone
// shipping_address
// password
// user_id
// role

//Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrpyt.hash(user.password, 8)
    }
    next()
})

//Validate ObjectId
userSchema.statics.isValidID = async (_id) =>  mongoose.Types.ObjectId.isValid(_id) || false


const User = mongoose.model('user', userSchema)


module.exports = User