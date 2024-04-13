const express = require('express');
const router = express.Router();
const examRegistrationController = require('../controllers/examController');

router.post('/register-exam/:userId/:courseId', examRegistrationController.registerExam);

module.exports = router;
