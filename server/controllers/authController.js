const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('./../models/user');
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    try{
        // If the user already exists
        const user = await User.findOne({email: req.body.email});

        // if user exists, send an error message
        if(user){
            return res.send({
                message: 'User already exists.',
                success: false
            })
        }       

        // we will not save the password in plain format in our database , we will encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword; // we will store the password in encrypt format not in plain format

        // Create new user, save in DB
        const newUser = new User(req.body);
        await newUser.save();

        res.send({
            message: 'User created successfully',
            success: true
        });

    }catch(error){
        res.send({
            message: error.message,
            success: false
        });
    }
})

router.post('/login' , async (req ,res) => {
    try {

        // check if the user exists with that email
        const user = await User.findOne({email:req.body.email})
        if(!user){ // if user does not exist
            return res.send({
                message: 'User does not exist',
                success: false
            })
        }
        
        // if email exists but password is incorrect
        const isValidPassword = await bcrypt.compare(req.body.password , user.password); // it will compare the plain password and encrypted password
        if(!isValidPassword){
            return res.send({
                message: 'invalid password',
                success: false
            })
        }

        // if the user exists and password is correct then assign jwt token
        const token = jwt.sign({userId: user._id} , process.env.SECRET_KEY , {expiresIn:"1d"}) // it will create a token for _id

        res.send({
            message: 'user logged-in successfully',
            success: true,
            token: token
        });

    } 
    catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
})

module.exports = router;