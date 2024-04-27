const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SEC = process.env.CLIENT_SEC;
REFRESH_TOKEN = process.env.REFRESH_TOKEN;
USER = process.env.USER;
EMAIL_SEC=process.env.SECRET_KEY;
// Create an OAuth2 client using your client credentials
const oAuth2Client = new OAuth2Client({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SEC,
  redirectUri: 'https://developers.google.com/oauthplayground',
});

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Set up the Gmail API
const gmail = google.gmail({
  version: 'v1',
  auth: oAuth2Client,
});

// Create a function to send a verification email
async function sendVerificationEmail(recipientEmail, verificationToken) {
  try {
   
    // Get an access token for the OAuth2 client
    const { token } = await oAuth2Client.getAccessToken();

    // Create a nodemailer transporter using the Gmail API
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SEC,
        refreshToken: REFRESH_TOKEN,
        accessToken: token,
      },
    });

    // Construct the verification link
    const verificationLink = `http://localhost:5500/elearning/auth/verify-email/${recipientEmail}/${verificationToken}`;

    // Set up the email data
    const mailOptions = {
      from: USER,
      to: recipientEmail,
      subject: 'Email Verification',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };

    // Send the email using the nodemailer transporter
    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', result);
  } catch (err) {
    console.error('Error sending verification email:', err);
  }
}


function isValidVerificationToken(token) {
    // Adjust these values based on your token requirements
    const decoded=jwt.verify(token,EMAIL_SEC);
    return (
      decoded.userId
    );
  }


  // Create a function to send a password reset email
async function sendPasswordResetEmail(recipientEmail, resetToken) {
  try {
    // Get an access token for the OAuth2 client
    console.log("sendPasswordrest");
    const { token } = await oAuth2Client.getAccessToken();
  // Send the password reset email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SEC,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
});

// const resetLink = `http://localhost:5500/elearning/auth/resetPass/${resetToken}`;
const resetLink=`http://localhost:3000/resetPassword/${resetToken}`
const mailOptions = {
    from: USER,
    to: recipientEmail,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password for CampKode Learnings.</p>`,
};

const result = await transporter.sendMail(mailOptions);
console.log('Password reset email sent:', result);

} catch (error) {
console.error('Error sending password reset email:', error);
}
};

//week content published mail

async function sendWeekContentPublished(recipientEmail, week, courseName, deadline, course_link, assignment_link) {
  try {
    // Get an access token for the OAuth2 client
 
    const { token } = await oAuth2Client.getAccessToken();
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SEC,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
});


const mailOptions = {
    from: USER,
    to: recipientEmail,
    subject: `${courseName}-Week ${week} Content is Live Now!!`,
    html: `<p>
    Dear Students
    <br>

    The lecture videos for Week ${week} have been uploaded for the course ${courseName}.<br><br> The lectures can be accessed using the following link: ${course_link}<br><br>
    
    
    The other lectures of this week are accessible from the navigation bar to the left. Please remember to login into the website to view contents (if you aren't logged in already).<br><br>
    
    
    Assignment ${week} for Week  ${week} is also released and can be accessed from the following link: ${assignment_link}<br><br>
    
    
    The assignment has to be submitted on or before ${deadline}.<br><br>
    
    
    As we have done so far, please use the discussion forums if you have any questions on this module.<br><br>
    
    
    Note : Please check the due date of the assignments in the announcement and assignment page if you see any mismatch write to us immediately.<br><br>
    
    Thanks and Regards,<br><br>
    
    --CampKode Learners Team<br><br>
    
    </p>`,
};

const result = await transporter.sendMail(mailOptions);
console.log('Week content email sent:', result);

} catch (error) {
console.error('Error sending week content email:', error);
}
};

//feedback mail

async function feedbackRemainder(recipientEmail, week, courseName, feedback_link) {
  try {
    // Get an access token for the OAuth2 client
 
    const { token } = await oAuth2Client.getAccessToken();
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SEC,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
});


const mailOptions = {
    from: USER,
    to: recipientEmail,
    subject: `${courseName}-Week ${week} Feedback Form`,
    html: `<p>
    Dear Students
    <br>

    Thank you for enrolling in this CampKode course and we hope you have gone through the contents for this week and also attempted the assignment.<br><br>

We value your feedback and wish to know how you found the videos and the questions asked - whether they were easy, difficult, as per your expectations, etc<br><br>

We shall use this to make the course better and we can also know from the feedback which concepts need more explanation, etc.<br><br>


Please do spare some time to give your feedback - comprises just 5 questions - should not take more than a minute, but makes a lot of difference for us as we know what the Learners feel.<br><br>


Here is the link to the form: ${feedback_link}<br><br>

    
    Thanks and Regards,<br><br>
    
    --CampKode Learners Team<br><br>
    
    </p>`,
};

const result = await transporter.sendMail(mailOptions);
console.log('feedback form mail sent:', result);

} catch (error) {
console.error('Error sending feedback form mail:', error);
}
};
//assignment solution released
async function assignmentSolution(recipientEmail, week, courseName, solution_link) {
  try {
    // Get an access token for the OAuth2 client
 
    const { token } = await oAuth2Client.getAccessToken();
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SEC,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
});


const mailOptions = {
    from: USER,
    to: recipientEmail,
    subject: `${courseName}-Week ${week} Assignment Solution Released`,
    html: `<p>
    Dear Students
    <br>
    The Assignment - ${week} of Week -${week} Solution for the course ${courseName} has been released in the portal.<br><br> Please go through the solution<br>
Here is the link to the form: ${solution_link}<br><br>

    
    Thanks and Regards,<br><br>
    
    --CampKode Learners Team<br><br>
    
    </p>`,
};

const result = await transporter.sendMail(mailOptions);
console.log('assignment solution mail sent:', result);

} catch (error) {
console.error('Error sending assignment solution mail:', error);
}
};
//hallticket release
async function hallticketRelease(recipientEmail, courseName, examMonth) {
  try {
    // Get an access token for the OAuth2 client
 
    const { token } = await oAuth2Client.getAccessToken();
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SEC,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
});


const mailOptions = {
    from: USER,
    to: recipientEmail,
    subject: `Campkode Exam- ${courseName} Halltickets Released`,
    html: `<p>
    Dear Students
    <br>
    
Your Hall Ticket / admit card for the CampKode Exam(s) in ${examMonth} has been released.<br><br>

You may have received an email with a link to download the Hall ticket to your registered email ID. Please refer to it for further details.<br><br>

It is the responsibility of the candidate to download the hall ticket at their end. Please check your registered email ID.<br><br>

Note: Requests for changes in exam city, exam center, exam date, session, or course will NOT be entertained.<br><br>
    
    Thanks and Regards,<br><br>
    
    --CampKode Learners Team<br><br>
    
    </p>`,
};

const result = await transporter.sendMail(mailOptions);
console.log('hallticket release mail sent:', result);

} catch (error) {
console.error('Error sending hallticket release  mail:', error);
}
};

async function examFormat(recipientEmail, courseName, examMonth) {
  try {
    // Get an access token for the OAuth2 client
 
    const { token } = await oAuth2Client.getAccessToken();
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SEC,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
});


const mailOptions = {
    from: USER,
    to: recipientEmail,
    subject: `Campkode Exam Format- ${courseName}!!! `,
    html: `<p>
    Dear Students
    <br>
    
    You will have to appear at the allotted exam center and produce your Hall ticket and Government Photo Identification Card (Example: Driving License, Passport, PAN card, Voter ID, Aadhaar-ID with your Name, date of birth, photograph and signature) for verification and take the exam in person. You can find the final allotted exam center details in the hall ticket.<br><br>

    The hall ticket is yet to be released. We will notify the same through email and SMS.<br><br>
    
    Type of exam: Computer based exam (Please check in the above list corresponding to your course name)<br><br>
    
    The questions will be on the computer and the answers will have to be entered on the computer; type of questions may include multiple choice questions, fill in the blanks, essay-type answers, etc.<br><br>
    
    Type of exam: Paper and pen Exam (Please check in the above list corresponding to your course name)<br><br>
    
    The questions will be on the computer. You will have to write your answers on sheets of paper and submit the answer sheets. Papers will be sent to the faculty for evaluation.<br><br>
    
    On-Screen Calculator Demo Link:<br><br>
    
    Kindly use the below link to get an idea of how the On-screen calculator will work during the exam.<br><br>
    
    https://tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html<br><br>
    
    NOTE: Physical calculators are not allowed inside the exam hall.<br><br>
    
    Thanks and Regards,<br><br>
    
    --CampKode Learners Team<br><br>
    
    </p>`,
};

const result = await transporter.sendMail(mailOptions);
console.log('Exam format mail sent:', result);

} catch (error) {
console.error('Error sending exam format mail:', error);
}
};
  
module.exports = {
  sendVerificationEmail,
  isValidVerificationToken,
  sendPasswordResetEmail,
  sendWeekContentPublished,
  feedbackRemainder,
  assignmentSolution,
  hallticketRelease,
  examFormat
};
