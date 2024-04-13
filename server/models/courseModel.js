const mongoose = require('mongoose');

const resourcesSchema = new mongoose.Schema({
    title:String,
    description:String,
    video:String,
})

const assignmentSchema = new mongoose.Schema({
    title: String,
    questions: [{
        question: String,
        options: [String],
        correctAnswerIndex: Number
    }],
    deadline:Date
})

const lectureSchema = new mongoose.Schema({
    url:String
})

const moduleSchema = new mongoose.Schema({
    week:Number,
    courseId:{type:mongoose.Schema.Types.ObjectId,ref:'Course'},
    resources:[{type: mongoose.Schema.Types.ObjectId,ref:'Resources'}],
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    lectures: [{type:mongoose.Schema.Types.ObjectId, ref:'Lectures'}],
})


const courseSchema = new mongoose.Schema({
    title:String,
    instructors: [{ type: String }],
    duration:String,
    category:String,
    enrollmentStatus:String,
    syllabus:String,
    rating: Number,
    modules:[{type:mongoose.Schema.Types.ObjectId,ref:'Modules'}],
    reviews:[{content:String}],
    enrollmentCount:Number
})


const Resources = mongoose.model('Resources',resourcesSchema);
const Assignment = mongoose.model('Assignment',assignmentSchema);
const Lectures = mongoose.model('Lectures',lectureSchema);
const Modules = mongoose.model('Modules',moduleSchema);
const Course = mongoose.model('Course',courseSchema);
module.exports = {Resources,Assignment, Lectures,Modules,Course};