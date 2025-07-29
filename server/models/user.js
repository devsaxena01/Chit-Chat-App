const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        //minlength:8 // the password should have a minimum of length 8 
    },
    profilePic:{
        type: String,
        required: false
    }
} , {timestamps:true})

module.exports = mongoose.model('users' , userSchema);