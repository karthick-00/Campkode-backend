const mongoose = require('mongoose');

const resourcesSchema = new mongoose.Schema({
    title:String,
    description:String,
    video:String,
})

const assignmentSchema = new mongoose.Schema({
    title: String,
    questions: [{
        description: String,
        options: [String],
        correctAnswerIndices: [Number], // Allow multiple correct answers
        answerDescription:String,
        allowsMultipleSelection: { type: Boolean, default: false }, // Flag to indicate if multiple answers are allowed
        marks: { type: Number, default: 1 } // Marks for the question, default to 1
    }],
    deadline: Date
});

const lectureSchema = new mongoose.Schema({
    url:String
})

const moduleSchema = new mongoose.Schema({
    week:Number,
    courseId: { type: String, ref: 'Course' },
    resources:[{type: mongoose.Schema.Types.ObjectId,ref:'Resources'}],
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    lectures: [{type:mongoose.Schema.Types.ObjectId, ref:'Lectures'}],
})


const courseSchema = new mongoose.Schema({
  
    courseId: { type: String, unique: true },
    title:String,
    instructors: [{ type: String }],
    duration:Number,
    category:String,
    enrollmentStatus:String,
    syllabus:Buffer,
    rating: Number,
    modules:[{type:mongoose.Schema.Types.ObjectId,ref:'Modules'}],
    reviews:[{content:String}],
    enrollmentCount:Number,
    image:String,
    
})


const Resources = mongoose.model('Resources',resourcesSchema);
const Assignment = mongoose.model('Assignment',assignmentSchema);
const Lectures = mongoose.model('Lectures',lectureSchema);
const Modules = mongoose.model('Modules',moduleSchema);
const Course = mongoose.model('Course',courseSchema);
module.exports = {Resources,Assignment, Lectures,Modules,Course};