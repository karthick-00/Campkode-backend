const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    country: String,
    state: String,
    city: String,
    phone: String,
    altPhone: String,
    gender:String,
    idProof: String,
    signatureProof: String,
    profilePhoto: String,
    isVerified:Boolean,
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
const User = mongoose.model('User', userSchema);
module.exports = User;