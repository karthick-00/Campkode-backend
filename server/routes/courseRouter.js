const express = require('express');
const courseController = require('../controllers/courseController');
const router = express.Router();

router.post('/addCourse',courseController.addCourse);
router.post('/addAssignment/:moduleId',courseController.addAssignment);
router.get('/viewCourse/:courseId',courseController.viewCourse);
router.get('/viewAllCourses',courseController.viewAllCourses);
router.get('/course-filters',courseController.viewCoursesWithFilters);
router.delete('/removeCourse/:courseId',courseController.removeCourse);
router.delete('/removeAssignment/:moduleId',courseController.removeAssignment);
module.exports=router;