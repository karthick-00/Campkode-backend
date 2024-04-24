// exam.model.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  examDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  examCenter: { type: String, required: true },
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
