const express = require('express');
const router = express.Router();
const examRegistrationController = require('../controllers/examController');

router.post('/register-exam/:enrollmentId', examRegistrationController.registerExam);
router.post('/create-payment',examRegistrationController.createPayment);
router.put('/update-registered-exam/:examregisteredId',examRegistrationController.updateRegisteredExam);
router.get('/display-registered-exam/:examregisteredId',examRegistrationController.displayRegisteredExam);
router.get('/download-hallticket',examRegistrationController.createHallticket);
router.get('/getEnrollmentId/:userId/:courseId',examRegistrationController.getEnrollmentId);
router.delete('/remove-registered-exam/:examregisteredId',examRegistrationController.removeRegisteredExam);
module.exports = router;
