const {Resources, Assignment, Lectures, Modules, Course} = require('../models/courseModel');

const addCourse = async(req, res) => {
    try {
        const {
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

        return res.status(200).json({ message: 'Course added successfully', courseId: course._id });
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

const addAssignment = async (req,res) => {
    try {
        const moduleId = req.params.moduleId;
        const {
            title,
            questions,
            deadline
        } = req.body;
        const assignment = new Assignment({
            title,
            questions,
            deadline
        });
        await assignment.save();

        const module = await Modules.findById(moduleId);
        if (!module) throw new Error('Module not found');

        module.assignment = assignment._id;
        await module.save();

        return res.status(200).json({message:'Assignment Added Successfully', assignment});
    } catch (error) {
        // throw new Error(`Error adding assignment: ${error.message}`);
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
};

const removeAssignment = async (req,res) => {
    try {
        const moduleId = req.params.moduleId;
        const module = await Modules.findById(moduleId);
        if (!module) throw new Error('Module not found');

        if (!module.assignment) throw new Error('Assignment not found in this module');

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



module.exports={
    addCourse,
    removeCourse,
    viewCourse,
    viewAllCourses,
    viewCoursesWithFilters,
    addAssignment,
    removeAssignment 
}