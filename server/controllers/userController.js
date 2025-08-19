const router = require('express').Router()
const User = require('./../models/user')
const authMiddleware = require('./../middlewares/authMiddleware')
const message = require('../models/message');
const cloudinary = require('./../cloudinary');
const user = require('./../models/user');


// GET Details of current logged-in user
// this route should be accessible to the only authenticated users that's why we will use middleware
router.get('/get-logged-user' , authMiddleware , async (req , res) => {
    try {
       const user = await User.findOne({_id:req.body.userId}); // filter the user based on _id property

       // if we have get the user based on the userId then

       res.send({
        message: 'User fetched successfully',
        success: true,
        data: user
       });
    } 
    catch (error) {
        res.status(400).send({
        message:error.message,
        success:false
        })
    }
})


// fetch all the users
router.get('/get-all-users' , authMiddleware , async (req , res) => {
    try {
       const allUsers = await User.find({_id: {$ne: req.body.userId}}) // we will fetch all the users except the currently logged-in user and filter the users based on _id property like _id is not equal to req.body.userId
       
        res.send({
            message: 'All users fetched successfully',
            success: true,
            data: allUsers
        });
    } 
    catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.post('/upload-profile-pic', authMiddleware, async (req, res) => {
    try{
        const image = req.body.image;

        //UPLOAD THE IMAGE TO CLODINARY
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'Chit-Chat'
        })

        //UPDATE THE USER MODEL & SET THE PROFILE PIC PROPERTY
        const user = await User.findByIdAndUpdate(
            {_id: req.body.userId},
            { profilePic: uploadedImage.secure_url},
            { new: true}
        )

        res.send({
            message: 'Profic picture uploaded successfully',
            success: true,
            data: user
        })

    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})


module.exports = router;