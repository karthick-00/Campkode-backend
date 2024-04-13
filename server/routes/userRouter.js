const express = require('express');
const router= express.Router();

const userController = require('../controllers/userController');

router.post('/register-course/:userId/:courseId',userController.registerCourse);
router.post('/submit-assignment/:userId/:assignmentId',userController.submitAssignment);
router.get('/getregistered-courses/:userId',userController.displayRegisteredCourses);
router.get('/getcompleted-courses/:userId',userController.displayCompletedCourses);

module.exports=router;