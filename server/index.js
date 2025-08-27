const express = require('express')
const cors = require('cors')
const app = express()

const authRouter = require('./controllers/authController')
const userRouter = require('./controllers/userController')
const chatRouter = require('./controllers/chatController')
const messageRouter = require('./controllers/messageController')

// app.use(cors())

//Allow both localhost and deployed frontend
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://chatapp-7249.onrender.com" // replace with actual frontend URL
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json({
    limit: "50mb"
}));

const server = require('http').createServer(app)

// const io = require('socket.io')(server , {cors:{
//     origin:'http://localhost:3000',
//     methods:['GET' , 'POST']
// }})

const io = require('socket.io')(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://chatapp-7249.onrender.com" // replace with actual frontend URL
        ],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000
});


app.use('/api/auth' , authRouter)
app.use('/api/user' , userRouter)
app.use('/api/chat' , chatRouter)
app.use('/api/message' , messageRouter)

const onlineUser = []

//TEST SOCKET CONNECTION FROM CLIENT
io.on('connection', socket => {
    socket.on('join-room' , userid => {
        socket.join(userid)   
    })

    socket.on('send-message' , (message) => {
        
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('receive-message' , message)

        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('set-message-count' , message)
    })

    socket.on('clear-unread-messages', data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('message-count-cleared', data)
    })

    socket.on('user-typing', (data) => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('started-typing', data)
    })

    socket.on('user-login', userId => {
        if(!onlineUser.includes(userId)){
            onlineUser.push(userId)
        }
        socket.emit('online-users', onlineUser);
    })

    socket.on('user-offline', userId => {
        onlineUser.splice(onlineUser.indexOf(userId), 1);
        io.emit('online-users-updated', onlineUser);
    })
})


module.exports = server; // to export the app in other file