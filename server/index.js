const express = require('express');
const app = express();
const connectDB = require('./connection');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit= require('express-rate-limit');
// const performStartUp = require('./utils/startUp');
const PORT = 5500;
const limit = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 60,
    message: 'Too many request with this IP Address..Try again in 1 hour'
  });
// database connection
const { createAgent } = require('@forestadmin/agent');
connectDB().then(()=>{
    app.use(cors());
    app.options('*',cors());

    app.use(cookieParser());
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended:false}));

    app.use('/elearning',limit);
    const authRouter = require('./routes/authRouter');
    const courseRouter = require('./routes/courseRouter');
    const userRouter = require('./routes/userRouter');
    const examRouter = require('./routes/examRouter');
    const adminRouter = require('./routes/adminRouter');
    const notification=require('./routes/notificationRouter');

    app.use('/elearning/auth',authRouter);
    app.use('/elearning/courses',courseRouter);
    app.use('/elearning/users',userRouter);
    app.use('/elearning/exams',examRouter);
    app.use('/elearning/admin',adminRouter);
    app.use('/elearning/notification',notification);
    
    app.get('/',(req,res)=>{
        res.send("App is running..");
    })
// performStartUp().then(()=>{

    app.listen(PORT,()=>{
        console.log(`server is running on the port ${PORT}`);
    });

    // const agent = createAgent(options)
    
    // .addDataSource(createMongooseDataSource(require('./models')));
});

// });

module.exports=app;

