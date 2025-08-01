const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId , ref:"chats"
    },
    sender:{ // who is sending the message
        type:mongoose.Schema.Types.ObjectId , ref:"users"
    },
    text:{
        type:String,
        required:true
    },
    image:{
        type: String,
        required: false
    },
    read:{
        type:Boolean,
        default:false
    }
} , {timestamps: true})

module.exports = mongoose.model('messages' , messageSchema)