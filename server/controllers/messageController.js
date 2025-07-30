const route = require('express').Router();
const { router } = require('..');
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../models/chat');
const Message = require('./../models/message');

route.post('/new-message' , authMiddleware , async (req , res) => {
    try {

        // Store yhe message in message collection
       const newMessage = new Message(req.body)
       const savedMessage = await newMessage.save()

       // Update the lastMessage in message collection
        // const currentChat = await Chat.findById(req.body.chatId);
        // currentChat.lastMessage = savedMessage._id;
        // await currentChat.save()  
        
        // or we can do this in other way
        const currentChat = await Chat.findOneAndUpdate({
            _id:req.body.chatId // using chatId we will find the chat
        } , {
            lastMessage:savedMessage._id ,// we will update the lastMessage 
            $inc:{unreadMessageCount:1}
        });

        res.status(201).send({
            message: 'Message sent successfully',
            success: true,
            data: savedMessage
        })
        
    } catch (error) {
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
})

route.get('/get-all-messages/:chatId' , authMiddleware , async (req , res) => {
    try {
        
        const allMessages = await Message.find({chatId: req.params.chatId}).sort({createdAt: 1})
        res.status(201).send({
            message: 'Messages fetched successfully',
            success: true,
            data: allMessages
        })
        
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

module.exports = route