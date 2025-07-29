const router = require('express').Router()
const Chat = require('./../models/chat')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/create-new-chat' , authMiddleware , async (req , res) => {
    try {
        const chat = new Chat(req.body) // we are creating a new chat
        const savedChat = await chat.save() // chat will be saved in the database
         await savedChat.populate('members');
        
        res.status(201).send({
            message: 'Chat created successfully',
            success: true,
            data: savedChat
        })
    } catch (error) {
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
})

router.get('/get-all-chats' , authMiddleware , async (req , res) => {
    try {
        const allChats = await Chat.find({members: {$in: req.body.userId}})
        .populate('members')
        .populate('lastMessage')
        .sort({updatedAt: -1});
        
        // we want to get only those chats whose members array contain the userId of the currently logged-in user
        
        res.status(200).send({
            message: 'Chat fetched successfully',
            success: true,
            data: allChats
        })
    } catch (error) {
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
})

module.exports = router
