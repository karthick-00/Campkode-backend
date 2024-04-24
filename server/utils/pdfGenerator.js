const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to generate the PDF hall ticket
async function generateHallTicket(student, examDetails) {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the PDF to a writeable stream
  const outputPath = './pdf_file/hallticket.pdf';
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Add content to the first page
  doc.image('./public/images/logo.jpg', 50, 50, { width: 100 });
  doc.fontSize(24).text('CampKode Learners', { align: 'center' });
  doc.fontSize(18).text('Hall Ticket', { align: 'center' });
  // Add candidate's picture
  doc.image('./public/images/Profile.jpg',350,100, { width: 80, align: 'right' });
  doc.moveDown();
   
 
  // Tabular box for student details
  const table = {
    x: 50,
    y: 200,
    rowHeight: 30,
    columnWidth: 200,
  };

  // Student details table
  doc.font('Helvetica-Bold').fontSize(12).text('Student Details', table.x, table.y);
  doc.font('Helvetica').fontSize(12);
  const studentDetails = [
    ['Name:', student.name],
    ['DOB:', student.dob],
    ['Exam Name:', examDetails.examName],
    ['Exam Center:', examDetails.examCenter],
    ['Exam Time:', examDetails.examTime],
    ['Reporting Time:', examDetails.reportingTime],
    ['Gate Closing Time:', examDetails.gateClosingTime],
    ['Session:', examDetails.session],
    ['Exam Center Address:', examDetails.examCenterAddress],

  ];

  // Draw the student details table
  for (const [index, [label, value]] of studentDetails.entries()) {
    doc.text(label, table.x, table.y + (index + 1) * table.rowHeight);
    doc.text(value, table.x + table.columnWidth, table.y + (index + 1) * table.rowHeight);
  }

  // Add candidate's signature

  doc.image('./public/images/signature.jpg',{ width: 80, align: 'right' });
 
  doc.text('Candidate Signature', table.x, table.y + (studentDetails.length + 2) * table.rowHeight,{align:'center'});
  doc.moveDown();
  doc.addPage();
  doc.fontSize(18).text('Exam Instructions', { align: 'center' });
  doc.moveDown();

  const examInstructions = [
    {
        header:'Hall ticket and Entry',
        points:[
            'The Hall Ticket must be presented for verification along with one original photo identification (not photocopy or scanned copy). Examples of acceptable photo identification documents are School ID, College ID, Employee ID, Driving License, Passport, PAN card, Voter ID, and Aadhaar-ID. A printed copy of the hall ticket and original photo ID card should be brought to the exam centre. Hall ticket and ID card copies on the phone will not be permitted.',
            'This Hall Ticket is valid only if the candidate’s photograph and signature images are legible. To ensure this, print the Hall Ticket on A4-sized paper using a laser printer, preferably a color photo printer.',
            'TIMELINE: 8:00 am - Report to the examination venue | 8:40 am – Candidates will be permitted to occupy their allotted seats| 8:50 am – Candidates can login and start reading instructions prior to the examination | 9:00 am - Exam starts |9:30 am - Gate closes, candidates will not be allowed after this time | 10:30 am Submit button will be enabled | 12:00 pm exam ends',
            'Candidates will be permitted to appear for the examination ONLY after their credentials are verified by center officials.',

        ],
       
      
    },
    {
        header:'STATIONERY REQUIREMENTS',
        points:[
            'A4 sheets will be provided to candidates for rough work. Candidates have to write their name and registration number on the A4 Sheets before they start using it. The A4 sheets must be returned to the invigilator at the end of the examination.',
            'On-screen calculator will be available during the exam. Candidates are advised to familiarize themselves with this virtual Scientific calculator well ahead of the exam.Link: https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html.',
            'You should bring your own pen/pencil; it will NOT be given at the examination centre.'
        ],
    },
  

  ];

  doc.fontSize(14);
  for (const instruction of examInstructions) {
    doc.font('Helvetica-Bold').text(instruction.header).font('Helvetica');
    doc.moveDown();
    for (const point of instruction.points) {
      doc.text(`• ${point}`).moveDown();
    }
    doc.moveDown();
  }

  // Add candidate's signature
 
  doc.text('Candidate Signature');
  doc.image('./public/images/signature.jpg', { width: 80, align: 'right' });
  doc.end();

  return outputPath;
}

// Function to generate the PDF for assignment answers
async function generateAssignmentAnswers(assignmentNumber, questions) {
  const doc = new PDFDocument({ margin: 50 });
 

  const outputPath = `./pdf_file/assignment_answers_${assignmentNumber}.pdf`;
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Add content to the first page
  doc.fontSize(24).text('CampKode Learners', { align: 'center' });
  doc.fontSize(18).text(`${assignmentNumber}`, { align: 'center' });
  doc.moveDown();

  // Display each question along with options and correct answer
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const { description, options, correctAnswer, answerDescription } = question;

    // Display question description
    doc.fontSize(14).text(`Question ${i + 1}: ${description}`, { align: 'left' });
    doc.moveDown();
    // Display options
    for (let j = 0; j < options.length; j++) {
      const option = options[j];
      doc.fontSize(12).text(`${String.fromCharCode(97 + j)}. ${option}`, { align: 'left' });
      // doc.moveDown();
    }

    // Display correct answer
    doc.fontSize(12).text(`Correct Answer: ${String.fromCharCode(97 + correctAnswer)}`, { align: 'left' });
    doc.moveDown();
    // Display answer description
    doc.fontSize(12).text(`Answer Description: ${answerDescription}`, { align: 'left' });

    doc.moveDown();
  }

  doc.end();

  return outputPath;
}

module.exports= {
  generateHallTicket,
  generateAssignmentAnswers
}





