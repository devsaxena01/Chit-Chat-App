const mongoose = require('mongoose')

const userSchema = new mongoose.schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        required:false
    }
} , {timestamps:true})

module.exports = mongoose.model('users' , userSchema);