const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    answers: [{
        questionIndex: Number,
        selectedAnswerIndices: [Number] // Array to store selected answer indices
    }],
    submittedAt: { type: Date, default: Date.now },
    marks:Number
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports=Submission;
