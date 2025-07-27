const dotenv = require('dotenv')
dotenv.config({path: './.env'})

const dbconfig = require('./config/dbConfig')
const app = require('./index') // to import the app from another file
                      
const port = process.env.PORT_NUMBER || 3000;
app.listen(port , (req , res)=>{
    console.log("server is running on PORT: " + port)
    
})

