const User = require('../models/userModel');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const mail = require('../utils/mail');
const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const resetToken = process.env.RESET_TOKEN;
const jwtSecret = process.env.SECRET_KEY;
const emailSecret = process.env.SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRESIN;
const { isValidVerificationToken } = require('../utils/mail');

function generateVerificationToken(user) {
 
    const token = jwt.sign({ userId: user._id }, emailSecret,  {expiresIn:expiresIn});
    console.log(token);
    return token;
}

const signUp = async(req,res)=>{
    try{
        const{
            email,
            password,
            phone
        }=req.body;

        const existUser = await User.findOne({email});
        if(!existUser){

        const hashedPassword=await bcrypt.hash(password, 10);
           const newUser = await User.create({
                email,
                password:hashedPassword,
                phone
            });
            console.log('user');
            const verificationToken = generateVerificationToken(newUser);
            await mail.sendVerificationEmail(email,verificationToken);
            return res.status(200).json({message:"User created successfully"});
        }
        else{
            return res.status(401).json({message:"User already exists"});
        }

    }
    catch(error){
        console.error('Error Signup users',error);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

const verifyEmail= async(req, res)=> {
    try{
    const token  = req.params.token;
    const email= req.params.email;

    console.log(token);
    if (!isValidVerificationToken(token)) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
  
    // Find the user by their email (assuming email is the unique identifier)
    const user = await User.findOne({ email: email });
  
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    // Mark the user's email as verified
    user.isVerified = true;

    // Save the changes to the user's document in the database
    await user.save();
    
    return res.redirect('http://localhost:3000/Login');
}catch(error){
    console.log('Token verification failed:' ,error);
    return res.status(400).json({error:'Email Verification failed'})
}
  }
  

const login = async(req,res)=>{
    try{

        const{
            email,
            password
        }=req.body;
      
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:'User does not exist'});
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(401).json({message:'Invalid Password'});
        }
        if(!user.isVerified){
            const verificationToken = generateVerificationToken(user);
           
           await mail.sendVerificationEmail(user.email, verificationToken);
            return res.status(401).json({ message: 'Account not verified. Verification email sent.' });
        }
        // console.log(expiresIn);
        const token = jwt.sign({ userId: user._id },jwtSecret, {expiresIn:expiresIn});
        const userId = user._id;
        const cookieOptions = {
            expires: new Date(Date.now() + (process.env.COOKIE_EXPIRESIN * 60 * 60 * 1000)),
            httpOnly: true
        };
   
        res.cookie('jwt', token, cookieOptions);
   
        
        res.status(200).json({data:{
            token,
            userId
        } });
    }
    catch(error){
        console.error('Error logging in',error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const forgotPassword = async (req, res) => {
    try{
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error(`User with email ${email} not found`);
    }

    await mail.sendPasswordResetEmail(user.email, generateVerificationToken(user));
    return res.status(200).json({
        message: "Reset Password link Sent in mail"
    })
}catch(error){
    console.error(error);
    return res.status(500).json({message:'Internal Server Error'});
}
};

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const {newPassword} = req.body;

        const decoded = jwt.verify(token, emailSecret);

        const user = await User.findOne({_id: decoded.userId});

        if (!user) {
            throw new Error(`Invalid token or token expired`);
        }
        console.log(newPassword);
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({message: 'Password reset successful'});
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({message: 'Error resetting password'});
    }
};

module.exports={
    signUp,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword
}