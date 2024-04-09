const express = require('express');
const app = express();
const connectDB = require('./connection');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit= require('express-rate-limit');
const performStartUp = require('./utils/startUp');
const PORT = 5500;
const limit = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 60,
    message: 'Too many request with this IP Address..Try again in 1 hour'
  });
// database connection

connectDB().then(()=>{
    app.use(cors());
    app.options('*',cors());

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

    app.use('/elearning',limit);
    const authRouter = require('./routes/authRouter');

    app.use('/elearning/auth',authRouter);
    
    app.get('/',(req,res)=>{
        res.send("App is running..");
    })
performStartUp().then(()=>{

    app.listen(PORT,()=>{
        console.log(`server is running on the port ${PORT}`);
    });
});

});

module.exports=app;

