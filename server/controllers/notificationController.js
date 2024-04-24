const { Course} = require('../models/courseModel');
const User = require('../models/userModel');
const Exam = require('../models/examModel');
const mail = require('../utils/mail');
const Enrollment = require('../models/enrollmentModel');

const weekContentPublished = async(req,res)=>{
    try{
        const{
            weekNumber,
            CourseId,
            deadline,
            course_link,
            assignment_link
        }=req.body;

        const course = await Course.findOne({courseId:CourseId});
   
        const enrollments = await Enrollment.find({courseId:course._id});
     
        enrollments.forEach(async(enrollment)=>{
            const userId=enrollment.userId;
            
            const user = await User.findById(userId);
       
            await mail.sendWeekContentPublished(user.email,weekNumber,course.title,deadline,course_link, assignment_link);
        })
        return res.status(200).json({message:'Mail sent Successfully'});
    }catch(error){
        console.error(error);
        return res.status(500).json({error});
    }
}

const feedbackMail = async(req,res)=>{
    try{
        const{
            weekNumber,
            CourseId,
            feedback_link
        }=req.body;

        if(!weekNumber || !CourseId || !feedback_link){
            return res.status(404).json({message:"Provide necessary details"});
        }

        const course = await Course.findOne({courseId:CourseId});
   
        const enrollments = await Enrollment.find({courseId:course._id});
     
        enrollments.forEach(async(enrollment)=>{
            const userId=enrollment.userId;
            
            const user = await User.findById(userId);
       
            await mail.feedbackRemainder(user.email,weekNumber,course.title,feedback_link);
        })
        return res.status(200).json({message:'Mail sent Successfully'});

    }catch(error){
        console.error(error);
        return res.status(500).json({error});
    }
}

module.exports={
    weekContentPublished,
    feedbackMail
};
