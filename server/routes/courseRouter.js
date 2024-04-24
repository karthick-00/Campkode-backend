const express = require('express');
const courseController = require('../controllers/courseController');
const router = express.Router();

router.get('/generateAssignmentAnswers',courseController.createAssignmentAnswers);
router.get('/viewCourse/:courseId',courseController.viewCourse);
router.get('/viewAllCourses',courseController.viewAllCourses);
router.get('/course-filters',courseController.viewCoursesWithFilters);

module.exports=router;