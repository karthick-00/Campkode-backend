const { Course} = require('../models/courseModel');
const {generateAssignmentAnswers} = require('../utils/pdfGenerator');
const fs= require('fs');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const viewCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId)
            .populate({
                path: 'modules',
                populate: [
                    { path: 'resources', select: '-_id  title description video' },
                    { 
                        path: 'assignment', 
                        select: '-_id  title deadline',
                        populate: { 
                            path: 'questions', 
                            select: '-_id question options correctAnswerIndex' 
                        } 
                    },
                    { path: 'lectures', select: '-_id  url' }
                ],
                select: '-_id week resources assignment lectures'
            });

        if (!course) {
            return res.status(400).json({ message: 'Course not available' });
        }

        return res.status(200).json(course);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const viewAllCourses = async(req,res)=>{
    try{
        const AllCourses = await Course.find().populate({
            path:'modules',
            populate:[
                { path: 'resources', select: '-_id  title description video' },
                { path: 'assignment', select: '-_id  title questions deadline', populate: { path: 'questions', select: '-_id question options correctAnswerIndex' }  },
                { path: 'lectures', select: '-_id  url' }
            ],
            select: '-_id week resources assignment lectures'
        })
        if(!AllCourses){
            return res.status(404).json({message:'No course Available'});
        }
        return res.status(200).json(AllCourses);
    }catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

const viewCoursesWithFilters = async (req, res) => {
    try {
        // Extract query parameters for filters
        const { category, duration, title, enrollmentStatus } = req.query;

        // Construct filter object based on provided query parameters
        const filter = {};
        if (category) filter.category = category;
        if (duration) filter.duration = duration;
        if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (enrollmentStatus) filter.enrollmentStatus = enrollmentStatus;

        // Find courses based on filters
        const courses = await Course.find(filter);

        return res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const createAssignmentAnswers = async(req,res)=>{

try{
    const assignment='ASSIGNMENT 1';
    const questions = [
        {
          description: 'What is the capital of France?',
          options: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctAnswer: 1, 
          answerDescription: 'Paris is the capital of France.',
        },
        {
          description: 'Which planet is known as the Red Planet?',
          options: ['Jupiter', 'Venus', 'Mars', 'Saturn'],
          correctAnswer: 2, 
          answerDescription: 'Mars is known as the Red Planet due to its reddish appearance.',
        },
        
      ];
    const path = await generateAssignmentAnswers(assignment, questions);
        await sleep(1000);
        const pdfBuffer = fs.readFileSync(path);
        console.log('function called');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
        res.send(pdfBuffer);
}catch(e){
    console.error(e);
    return res.status(500).json({error:'Internal Server Error'});
}
  
}


module.exports={
    viewCourse,
    viewAllCourses,
    viewCoursesWithFilters,
    createAssignmentAnswers
}