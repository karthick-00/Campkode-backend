const express = require('express');
const router= express.Router();

const notification = require('../controllers/NotificationController');

router.post('/weekContent', notification.weekContentPublished);
router.post('/feedback', notification.feedbackMail);
module.exports=router;