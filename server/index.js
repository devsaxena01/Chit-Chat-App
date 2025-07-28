const express = require('express')
const app = express()

const authRouter = require('./controllers/authController')
const userRouter = require('./controllers/userController')

app.use(express.json());
app.use('/api/auth' , authRouter)
app.use('/api/user' , userRouter)

module.exports = app; // to export the app in other file