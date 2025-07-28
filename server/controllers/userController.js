const router = require('express').Router()
const User = require('./../models/user')
const authMiddleware = require('./../middlewares/authMiddleware')

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

module.exports = router;