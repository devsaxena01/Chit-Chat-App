const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('./../models/user');

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

        res.status(201).send({
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

module.exports = router;