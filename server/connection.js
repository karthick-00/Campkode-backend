const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

const connectDB = async() =>{
    try{
        const atlasConnectionString = process.env.ATLAS_STRING;
        await mongoose.connect(atlasConnectionString,{

        });
        console.log('Connected to MongoDB Atlas');
    }
    catch(error){
        console.error('MongoDB connection Error: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;