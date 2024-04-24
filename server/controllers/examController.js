const ExamRegistration = require('../models/examRegisterModel');
const Razorpay= require('razorpay');
const {generateHallTicket} = require('../utils/pdfGenerator');
const fs= require('fs');
const Exam = require('../models/examModel');
const Enrollment = require('../models/enrollmentModel');
const User = require('../models/userModel');
const razorpayInstance = new Razorpay({ 

    key_id: 'rzp_test_R2x6F4CIXXlLC2', 

    key_secret: 'MfU9o3rMu5BRWv5uNQOU2DAj'
}); 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const registerExam = async (req, res) => {
    try {

        const enrollmentId = req.params.enrollmentId;
        const enrollment = await Enrollment.findById(enrollmentId);


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
            idProof,
            signatureProof,
            profilePhoto,
            examCity,
            examCenter
       
        } = req.body;

        const examRegistration = new ExamRegistration({
            enrollmentId,
            examCity,
            examCenter,
        });


        await examRegistration.save();
        const updatedProfile = await User.findByIdAndUpdate(enrollment.userId, {
            firstName,
            lastName,
            email,
            dateOfBirth,
            country,
            state,
            city,
            phone,
            altPhone,
            idProof,
            signatureProof,
            profilePhoto,
        },
    {new:true});

        return res.status(201).json({ message: 'Exam registration successful', examRegistration, updatedProfile });
    } catch (error) {
        console.error('Error registering exam:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateRegisteredExam = async(req,res)=>{
    try{
        const examregisteredId=req.params.examregisteredId;
            const{
            firstName,
            lastName,
            email,
            dateOfBirth,
            country,
            state,
            city,
            phone,
            altPhone,
            examCenter,
            examCity,
            idProof,
            signatureProof,
            profilePhoto
            } = req.body;

            const registeredExam = await ExamRegistration.findById(examregisteredId);
            if(!registeredExam){
               return res.status(404).json({message:'Exam Registration not found'});
            }
           const enrollment = await Enrollment.findById(registeredExam.enrollmentId);
            const updatedRegistration = await ExamRegistration.findByIdAndUpdate(examregisteredId, {
                examCity,
                examCenter,
                },{new:true});

                const updatedProfile = await User.findByIdAndUpdate(enrollment.userId, {
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                    country,
                    state,
                    city,
                    phone,
                    altPhone,
                    idProof,
                    signatureProof,
                    profilePhoto,
                },
            {new:true});
            return res.status(200).json({message:'Exam Registration Updated Successfully',updatedRegistration, updatedProfile});


    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal server error'});
    }
}

const displayRegisteredExam = async(req,res)=>{
    try{
        const examregisteredId=req.params.examregisteredId;
         const registeredExam = await ExamRegistration.findById(examregisteredId);
         if(!registeredExam){
            return res.status(404).json({message:'Exam Registration not found'});
         } 
         return res.status(200).json({registeredExam});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const removeRegisteredExam = async(req,res)=>{
    try{
         const examregisteredId=req.params.examregisteredId;
         const registeredExam = await ExamRegistration.findById(examregisteredId);
         if(!registeredExam){
            return res.status(404).json({message:'Exam Registration not found'});
         }
         await ExamRegistration.findByIdAndDelete(examregisteredId);
         return res.status(200).json({message:'Exam Registration removed successfully'});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const createPayment = async(req, res)=>{ 

	const {amount,currency,receipt, notes} = req.body;	 
 
	razorpayInstance.orders.create({amount, currency, receipt, notes}, 
		(err, order)=>{ 

		if(!err) 
			res.json(order) 
		else
			res.send(err); 
		} 
	) 
}

const createHallticket = async(req,res)=>{
    // Example student and exam details
const student = {
    name: 'Padmapriya',
    dob: '22-07-2004',
  };
  
  const examDetails = {
    examName: 'Introduction to Cloud Computing',
    examCenter: 'Sri Sairam Engineering College',
    examTime: '10:00 AM',
    reportingTime: '9:30 AM',
    gateClosingTime: '9:45 AM',
    session: 'Morning',
    examCenterAddress: 'Sai Leo Nagar, Tambaram.',
  };
  
//   // Generate the hall ticket
//   generateHallTicket(student, examDetails)
//     .then((outputPath) => console.log(`Hall ticket generated: ${outputPath}`))
//     .catch((error) => console.error('Error generating hall ticket:', error));
try{


    const path = await generateHallTicket(student, examDetails);
        await sleep(1000);
        const pdfBuffer = fs.readFileSync(path);
        console.log('function called');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
        res.send(pdfBuffer);
}catch(e){
    console.error(e);
    return res.status(500).json({error:'Internal Server Error'});
}
  
}



module.exports={
    registerExam,
    removeRegisteredExam,
    updateRegisteredExam,
    displayRegisteredExam,
    createPayment,
    createHallticket, 
}