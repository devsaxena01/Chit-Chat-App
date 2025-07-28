const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    members:{
        type:[
          {type: mongoose.Schema.Types.ObjectId , ref:"users" }  // Here we will take the userId of two users between whome the chat has started
        ]
    },
    lastmessage:{
        type:mongoose.Schema.Types.ObjectId , ref:"messages"
    },
    unreadMessageCount:{
        type: Number,
        default:0
    }
} , {timestamps:true})

module.exports = mongoose.model("chats" , chatSchema)