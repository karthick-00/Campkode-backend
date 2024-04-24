const {Resources, Assignment, Lectures, Modules, Course} = require('../models/courseModel');
const User = require('../models/userModel');
const Enrollment = require('../models/enrollmentModel');
const Submission = require('../models/submissionModel');
const bcrypt=require('bcrypt');

const registerCourse = async (req,res) => {
    try {
        const userId = req.params.userId;
        const courseId = req.params.courseId;
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        
        user.enrolledCourses.push(courseId);
        await user.save();
        // Create a new enrollment record
        const enrollment = new Enrollment({
            userId: userId,
            courseId: courseId,
            completionStatus: 'Incomplete',
            progress: 0
        });
        await enrollment.save();

        return res.status(200).json({message:'Course Registered Successfully',user});
    } catch (error) {
        // throw new Error(`Error registering course: ${error.message}`);
        return res.status(500).json({error:'Internal Server Error'});
    }
};

const displayRegisteredCourses = async (req,res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('enrolledCourses');
        if (!user) throw new Error('User not found');
        
        return res.status(200).json( user.enrolledCourses) ;
    } catch (error) {
        // throw new Error(`Error displaying registered courses: ${error.message}`);
        return res.status(500).json({error:'Internal Server Error'});
    }
};

const displayCompletedCourses = async (req,res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('completedCourses');
        if (!user) throw new Error('User not found');
        
       
        return res.status(200).json(user.completedCourses) ;
    } catch (error) {
     // throw new Error(`Error displaying completed courses: ${error.message}`);
     return res.status(500).json({error:'Internal Server Error'});
    }
};

const submitAssignment = async (req, res) => {
    try {
        const userId = req.params.userId;
        const assignmentId = req.params.assignmentId;
        const { answers } = req.body;

        // Get the assignment deadline
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        const deadline = assignment.deadline;

        // Get the last submission by the user for this assignment
        let submission = await Submission.findOne({ userId, assignmentId }).sort({ createdAt: -1 });

        // Get the current date and time
        const currentDate = new Date();

        // Check if the current date is before the deadline
        if (currentDate <= deadline) {
            if (submission) {
                // Update the last submission's answers
                submission.answers = answers;
            } else {
                // Create a new submission
                submission = new Submission({
                    userId,
                    assignmentId,
                    answers
                });
            }
            
            await submission.save();

            return res.status(200).json({ message: 'Assignment Submitted Successfully', submission });
        } else {
            return res.status(400).json({ error: 'Submission deadline has passed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const editProfile = async(req,res)=>{
    try{
    const userId= req.params.userId;
    const {
        name, 
        password,
        profile,
        phone
    }=req.body;
    const hashedPassword=await bcrypt.hash(password, 10);
    const updatedProfile = await User.findByIdAndUpdate(userId,
    {
        name, 
        password:hashedPassword,
        profile,
        phone

    },
{new:true});
return res.status(200).json({message:'Profile updated successfully', updatedProfile});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Error updating profile',error});
    }
    
}

const viewProfile = async(req,res)=>{
    try{
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        return res.status(200).json({user});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Error viewing profile',error});
    }
}

const getAssignmentMarks = async(req,res)=>{
    try{
        const userId= req.params.userId;
        const assignmentId= req.params.assignmentId;
        const submission = await Submission.findOne({ userId, assignmentId });
   
        if (!submission) return res.status(404).json({message:'Submission not found'});

        const answers = submission.answers;
    
        // Fetch assignment details
        const assignment = await Assignment.findById(assignmentId);
       
        if (!assignment) return res.status(404).json({message:'Assignment not found'});

        // Initialize total marks
        let assignmentAnswers=[];
        
  
        // Iterate through user's answers
        answers.forEach((questionIndex) => {
            let obtainedMarks=0;
            const qnIndex = questionIndex.questionIndex;
            const ansIndex =questionIndex.selectedAnswerIndices;
            const question = assignment.questions[qnIndex-1];
            const correctAnswerIndices = question.correctAnswerIndices;
            // Check if user's answer matches all of the correct answers
            const isCorrect = correctAnswerIndices.toString()===ansIndex.toString();
            // Increment total marks if answer is correct
            if (isCorrect) {
                obtainedMarks += question.marks;
            }
            assignmentAnswers.push({qnIndex,ansIndex,correctAnswerIndices,isCorrect,obtainedMarks});
            console.log(assignmentAnswers);
        });
  return res.status(200).json({message:'Evaluated answers', assignmentAnswers});

    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Error getting assignment marks', error});
    }
}


module.exports={
    registerCourse,
    displayCompletedCourses,
    displayRegisteredCourses,
    submitAssignment,
    editProfile,
    viewProfile,
    getAssignmentMarks
}


