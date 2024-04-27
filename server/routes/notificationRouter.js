const express = require('express');
const router= express.Router();

const notification = require('../controllers/NotificationController');

router.post('/weekContent', notification.weekContentPublished);
router.post('/feedback', notification.feedbackMail);
router.post('/assignmentSolution',notification.sendAssignmentSolution);
router.post('/hallticketNotification',notification.sendHallticketNotification);
router.post('/examFormat',notification.sendExamFormat);

module.exports=router;