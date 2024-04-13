const mongoose = require('mongoose');

const examRegistrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    firstName: String,
    lastName: String,
    email: String,
    dateOfBirth: Date,
    country: String,
    state: String,
    city: String,
    phone: String,
    altPhone: String,
    cityCenter: String,
    idProof: String,
    signatureProof: String,
    profilePhoto: String,
    paymentStatus: { type: String, default: 'Pending' },

});

const ExamRegistration = mongoose.model('ExamRegistration', examRegistrationSchema);
module.exports = ExamRegistration;
