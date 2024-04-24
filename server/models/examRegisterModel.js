const mongoose = require('mongoose');

const examRegistrationSchema = new mongoose.Schema({
    enrollmentId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' },
    examId:{type: mongoose.Schema.Types.ObjectId, ref: 'Exam'},
    examCity:String,
    examCenter: String,
    paymentStatus: { type: String, default: 'Pending' },
});

const ExamRegistration = mongoose.model('ExamRegistration', examRegistrationSchema);
module.exports = ExamRegistration;
