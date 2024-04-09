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
    console.log('token');
    const token = jwt.sign({ userId: user._id }, emailSecret,  expiresIn);
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
    const { token } = req.query;
    const userEmail = req.query.email;
  
    if (!isValidVerificationToken(token)) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
  
    // Find the user by their email (assuming email is the unique identifier)
    const user = await User.findOne({ email: userEmail });
  
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    // Mark the user's email as verified
    user.isVerified = true;

    // Save the changes to the user's document in the database
    await user.save();
  
    return res.status(200).json({ message: 'Email verification successful' });
  }
  

const login = async(req,res)=>{
    try{

        const{
            email,
            password
        }=req.body;
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'User does not exist'});
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(401).json({message:'Invalid Password'});
        }
        if(!user.isVerified){
            const verificationToken = generateVerificationToken(user);
            sendVerificationEmail(user.email, verificationToken);
            return res.status(401).json({ message: 'Account not verified. Verification email sent.' });
        }
        const token = jwt.sign({ userId: user._id },jwtSecret, expiresIn);
        res.status(200).json({ token});
    }
    catch(error){
        console.error('Error logging in',error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error(`User with email ${email} not found`);
    }

    // Generate a password reset token
    
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send the password reset email

    sendPasswordResetEmail(user.email, resetToken)

};

const resetPassword = async (req, res) => {
try {
  const { token, newPassword } = req.body;

  const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });

  if (!user) {
      throw new Error(`Invalid token or token expired`);
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
} catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
}
};

module.exports={
    signUp,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword
}