const {Resources, Assignment, Lectures, Modules, Course} = require('../models/courseModel');
const User = require('../models/userModel');
const Exam = require('../models/examModel');
const Submission = require('../models/submissionModel');
const Admin = require('../models/adminModel');
const bcrypt=require('bcrypt');
const addCourse = async(req, res) => {
    try {
        const {
            courseId,
            title,
            instructors,
            duration,
            category,
            enrollmentStatus,
            syllabus,
            modules,
        } = req.body;

        // Create a new course
        const course = new Course({
            courseId,
            title,
            instructors,
            duration,
            category,
            enrollmentStatus,
            syllabus,
            modules: [] // Initialize modules array
        });

        // Process each module and add to the Course
        for (const moduleData of modules) {
            const { week, lectures, resources, assignment } = moduleData;

            // Create lectures for the module
            const createdLectures = await Lectures.insertMany(lectures);

            // Create resources for the module
            const createdResources = await Resources.insertMany(resources);

            // Create assignments for the module
            const createdAssignments = await Assignment.insertMany(assignment);

            // Create a new module and add references to lectures, resources, and assignments
            const newModule = new Modules({
                week,
                courseId: course._id, // Reference to the course
                lectures: createdLectures.map(lecture => lecture._id),
                resources: createdResources.map(resource => resource._id),
                assignment: createdAssignments.length > 0 ? createdAssignments[0]._id : null // Assuming there's only one assignment per module
            });

            // Save the new module
            await newModule.save();

            // Add the module to the course
            course.modules.push(newModule);
        }

        // Save the course
        await course.save();

        return res.status(200).json({ message: 'Course added successfully', courseId: course.courseId });
    } catch (error) {
        console.error('Error Adding course', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const removeCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Find the course
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(400).json({ message: 'Course does not exist' });
        }
       // Iterate over each module
       for (const module of course.modules) {
        // Delete associated resources for the module
        await Resources.deleteMany({ _id: { $in: module.resources } });

        // Delete associated assignment for the module
        await Assignment.deleteOne({ _id: module.assignment });

        // Delete associated lectures for the module
        await Lectures.deleteMany({ _id: { $in: module.lectures } });

        // Delete the module itself
        await Modules.deleteOne({ _id: module._id });
    }

        // Finally, delete the course itself
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ message: 'Course Deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const addAssignment = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const { title, questions, deadline } = req.body;

        const modifiedQuestions = questions.map(question => ({
            description:question.description,
            options: question.options,
            correctAnswerIndices: Array.isArray(question.correctAnswerIndices) ? question.correctAnswerIndices : [question.correctAnswerIndex], // Convert single index to array
            answerDescription:question.answerDescription,
            allowsMultipleSelection: question.allowsMultipleSelection || false, 
            marks: question.marks || 1 
        }));
   

        const assignment = new Assignment({
            title,
            questions: modifiedQuestions,
            deadline
        });
  
        await assignment.save();
   
        const module = await Modules.findById(moduleId);
        if (!module) return res.status(404).json({message:'Module not found'});
   
        module.assignment = assignment._id;
      
        await module.save();
       

        return res.status(200).json({ message: 'Assignment Added Successfully', assignment });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'Internal server error' });
    }
};



const removeAssignment = async (req,res) => {
    try {
        const moduleId = req.params.moduleId;
        const module = await Modules.findById(moduleId);
        if (!module) return res.status(404).json({message:'Module not found'});

        if (!module.assignment) return res.status(404).json({message:'Assignment not found in this module'});

        await Assignment.findByIdAndDelete(module.assignment);
        module.assignment = null;
        await module.save();

        return res.status(200).json({message:'Assignment removed successfully'});
    } catch (error) {
        // throw new Error(`Error removing assignment: ${error.message}`);
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
};

const evaluateAnswers = async (req,res) => {
    try {
        const userId = req.params.userId;
        const assignmentId = req.params.assignmentId;
        // Fetch user's submission based on userId and assignmentId
        const submission = await Submission.findOne({ userId, assignmentId });
   
        if (!submission) return res.status(404).json({message:'Submission not found'});

        const answers = submission.answers;
    
        // Fetch assignment details
        const assignment = await Assignment.findById(assignmentId);
       
        if (!assignment) return res.status(404).json({message:'Assignment not found'});

        // Initialize total marks
        let totalMarks = 0;
        let obtainedMarks=0;
        let percentage=100;
        // Iterate through user's answers
        answers.forEach((answer) => {
            const qnIndex = answer.questionIndex;
            const ansIndex =answer.selectedAnswerIndices;
            const question = assignment.questions[qnIndex-1];
        
            const correctAnswerIndices = question.correctAnswerIndices;
       
            // Check if user's answer matches all of the correct answers
            const isCorrect = correctAnswerIndices.toString()===ansIndex.toString();
            totalMarks+=question.marks;
            // Increment total marks if answer is correct
            if (isCorrect) {
                obtainedMarks += question.marks;
            }
        });
        percentage *= obtainedMarks/totalMarks;
        // Update user's marks
        submission.marks = percentage;
        await submission.save();

       return res.status(200).json({message:'Evaluated answers', percentage});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'Error evaluating answers', error});
    }
};


const addExam = async(req,res)=>{
    try{
        const {
            examName,
        examDate,
        startTime,
        endTime,
        examCenter,
        }=req.body;

        const examData={
            examName,
        examDate,
        startTime,
        endTime,
        examCenter,
        }
        const exam = await Exam.create(examData);
    return res.status(200).json({message:'Exam Added Successfully',exam});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
}


const viewExam = async(req,res)=>{
    try{
        const examId = req.params.examId;
        const exam = await Exam.findById(examId);
        if(!exam){
            return res.status(404).json({message:'Invalid examId'});
        }
        return res.status(200).json({exam});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const viewAllExams = async(req,res)=>{
    try{
        const exams = await Exam.find();
        if(!exams){
            return res.status(404).json({message:'No exam Available'});
        }
        return res.status(200).json({exams});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const updateExam= async(req,res)=>{
    try{
        const examId = req.params.examId;
        const {
            examName,
            examDate,
            startTime,
            endTime,
            examCenter,
        }=req.body;
        const newData={
            examName,
        examDate,
        startTime,
        endTime,
        examCenter,
        }
        const exam = await Exam.findByIdAndUpdate(examId, newData, { new: true });
        if(!exam){
            return res.status(404).json({message:'Exam Not Available'});
        }
        return res.status(200).json({message:'Exam Updated Successfully', exam});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}
const deleteExam = async(req,res)=>{
    try{
        const examId = req.params.examId;
        const exam = await Exam.findByIdAndDelete(examId);
        if(!exam){
            return res.status(404).json({message:'Exam Not Available'});
        }
        return res.status(200).json({message:'Exam Deleted Successfully'});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const addAdmin = async(req,res)=>{
    try{
        const{
            name,
            bioData,
            email,
            password
        }= req.body;


        // const profilePhoto=req.file;
        // const base64 = await convertToBase64(profilePhoto);
        // function convertToBase64(file){
        //     return new Promise((resolve, reject)=>{
        //       const fileReader = new FileReader();
        //       fileReader.readAsDataURL(file);
        //       fileReader.onload = ()=>{
        //         resolve(fileReader.result)
        //       };
        //       fileReader.onerror =(error)=>{
        //         reject(error)
        //       }
        //     })
        //   }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            name,
            bioData,
            email,
            password:hashedPassword
        })
      
        return res.status(200).json({message:'Admin Added Successfully', newAdmin});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Error Adding an admin', error});
    }
}

const removeAdmin = async(req,res)=>{
    try{
        const {email} = req.body;
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(404).json({message:`Admin User with provided ${email} not found`});
        }
        await Admin.findOneAndDelete({admin});
        return res.status(200).json({message:`Admin User with provided ${email} deleted successfully`});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Error removing admin', error});
    }
}

module.exports={
    addCourse,
    removeCourse,
    addAssignment,
    removeAssignment ,
    evaluateAnswers,
    addExam,
    updateExam,
    deleteExam,
    viewAllExams,
    viewExam,
    addAdmin,
    removeAdmin
}