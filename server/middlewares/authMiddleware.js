// A middleware is nothing but a function

const jwt = require('jsonwebtoken');

module.exports = (req , res , next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // to verify whether a json web token is valid or not 
     const decodedToken = jwt.verify(token, process.env.SECRET_KEY);  // {userId: user._id}
     req.body = req.body || {};
     req.body.userId = decodedToken.userId;

     next(); // to call the next middleware so that the request will never stay forever in the same middleware
     
    } 
    catch (error) {
        res.send({
            message:error.message,
            success:false
        });
    }
}