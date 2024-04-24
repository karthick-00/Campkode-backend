const express = require('express');
const router= express.Router();
const adminController = require('../controllers/adminController');


router.post('/addCourse',adminController.addCourse);
router.post('/addAdmin',adminController.addAdmin);
router.post('/addAssignment/:moduleId',adminController.addAssignment);
router.post('/addExam',adminController.addExam);
router.put('/updateExam/:examId',adminController.updateExam);
router.get('/viewExam/:examId',adminController.viewExam);
router.get('/viewAllExams',adminController.viewAllExams);
router.get('/evaluateAnswers/:userId/:assignmentId',adminController.evaluateAnswers);
router.delete('/deleteExam/:examId',adminController.deleteExam);
router.delete('/removeCourse/:courseId',adminController.removeCourse);
router.delete('/removeAssignment/:moduleId',adminController.removeAssignment);
router.delete('/removeAdmin',adminController.removeAdmin);

module.exports=router;