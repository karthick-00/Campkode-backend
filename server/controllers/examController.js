const ExamRegistration = require('../models/examModel');

const registerExam = async (req, res) => {
    try {

        const userId = req.params.userId;
        const courseId = req.params.courseId;
        const {
          
            firstName,
            lastName,
            email,
            dateOfBirth,
            country,
            state,
            city,
            phone,
            altPhone,
            cityCenter,
            idProof,
            signatureProof,
            profilePhoto
       
        } = req.body;

        const examRegistration = new ExamRegistration({
            userId,
            courseId,
            firstName,
            lastName,
            email,
            dateOfBirth,
            country,
            state,
            city,
            phone,
            altPhone,
            cityCenter,
            idProof,
            signatureProof,
            profilePhoto

        });


        await examRegistration.save();

        return res.status(201).json({ message: 'Exam registration successful', examRegistration });
    } catch (error) {
        console.error('Error registering exam:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports={
    registerExam
}