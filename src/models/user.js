const {mongoose} = require ('../db/db')

const Schema = mongoose.Schema


const userSchema = new Schema({
    name: {
        type:String,
        required:true
    }
});


const User = mongoose.model('user',userSchema)


module.exports = User