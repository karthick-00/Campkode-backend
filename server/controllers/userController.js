const {Resources, Assignment, Lectures, Modules, Course} = require('../models/courseModel');
const User = require('../models/userModel');
const Enrollment = require('../models/enrollmentModel');
const Submission = require('../models/submissionModel');

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
        const {answers} = req.body;

        // Get the assignment deadline
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        const deadline = assignment.deadline;

        // Get the current date and time
        const currentDate = new Date();

        // Check if the current date is before the deadline
        if (currentDate <= deadline) {
            const submission = new Submission({
                userId,
                assignmentId,
                answers
            });
            await submission.save();

            return res.status(200).json({message:'Assignment Submitted Successfully', submission});
        } else {
            return res.status(400).json({ error: 'Submission deadline has passed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports={
    registerCourse,
    displayCompletedCourses,
    displayRegisteredCourses,
    submitAssignment
}


