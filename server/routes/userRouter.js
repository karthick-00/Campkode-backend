const express = require('express');
const router= express.Router();

const userController = require('../controllers/userController');

router.post('/register-course/:userId/:courseId',userController.registerCourse);
router.put('/submit-assignment/:userId/:assignmentId',userController.submitAssignment);
router.put('/editProfile/:userId',userController.editProfile);
router.get('/viewProfile/:userId',userController.viewProfile);
router.get('/getregistered-courses/:userId',userController.displayRegisteredCourses);
router.get('/getcompleted-courses/:userId',userController.displayCompletedCourses);
router.get('/getAssignmentMarks/:userId/:assignmentId',userController.getAssignmentMarks);

module.exports=router;