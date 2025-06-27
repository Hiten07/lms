import cron from 'node-cron';
import { Op } from 'sequelize';
import { sendMail,sendMailWithAttachment } from '../utils/mailer'; 
import { user } from '../models/user';
import { assignment } from '../models/assignment';
import { enrolled } from '../models/enrolled';
import { course } from '../models/course';
import { getInstructorReports } from "../services/report.services";
import { generatePDFWithPuppeteer } from '../utils/pdfgenerator';

const logEmailSent = (recipient: string, subject: string, purpose: string) => {
  console.log(`Email sent to: ${recipient}, Subject: "${subject}", Purpose: ${purpose}, Time: ${new Date().toISOString()}`);
};

async function notificationJob(logFn: CallableFunction) {

  const now = new Date();
  const threeDaysFromNow = new Date(now);

  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const expiringEnrollments = await enrolled.findAll({
    where: {
      validuntildate: {
        [Op.between]: [now, threeDaysFromNow]
      }
    },
    include: [
      {
        model: user,
        as: 'users'
      },
      {
        model: course,
        as: 'courses'
      }
    ]
  });

  for (const enroll of expiringEnrollments) {
    const recipientEmail = enroll.dataValues.email;
    const courseTitle = enroll.dataValues.title;

    const user = enroll.dataValues.users;

    await sendMail(
      recipientEmail,
      `Hello ${user.dataValues.firstname}, Your Course Has Been Expiring In Next 3 Days!`,
      `Your access to the course "${courseTitle}" expires soon. Please complete any pending lessons or contact your instructor.`,
      'Use the best of time and learn from the course'
    );

    logFn(recipientEmail, 'Course Access Expiry Notice', `Access expiry notification for course "${courseTitle}"`);
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const recentAssignments = await assignment.findAll({
    where: {
      createdAt: {
        [Op.gte]: yesterday
      }
    },
    include: {
      model: course,
      as: "courses"
    }
  });

  for (const assignmentInstance of recentAssignments) {

    // Query enrolled students for assignmentInstance.courseid using a query
    const enrolledStudents = await enrolled.findAll({
      where: {
        courseid: assignmentInstance.courseid
      },
      include: 
        {
          model: user,
          as: 'users',
          attributes: ["email","firstname","lastname"]
        }
    });

    const course = assignmentInstance.dataValues.courses; // course details of assignment

    for (const enrollment of enrolledStudents) {

      const user = enrollment.dataValues.users; // user details to which he/she is enrolled in course
      const recipientEmail = user.dataValues.email; // email of the  user 

      await sendMail(
        recipientEmail,
        `Hello ${user.dataValues.firstname} 👋🏻, New Assignment Added To Your Course !`,
        `A new assignment "${assignmentInstance.title}" has been added in "${course.dataValues.coursename} - ${course.dataValues.description}". Check it out!`,
        `Course description -  ${assignmentInstance.description}, 
        Due date for assignment - ${assignmentInstance.duedate}, 
        Please make sure you complete the assignment before the due date and submit it on time!`
      );

      logFn(recipientEmail, 'New Assignment Added', `Notification for new assignment "${assignmentInstance.title}"`);
    }
  }
}

cron.schedule('0 10 * * *', () => {
  notificationJob(logEmailSent).catch(err => {
    console.error('Error running notification job:', err);
  });
});

cron.schedule('0 8 * * *',async () => {
  const instructorReportDetails = await getInstructorReports();
  const filepath = await generatePDFWithPuppeteer(instructorReportDetails);


  await sendMailWithAttachment(  
    instructorReportDetails![0].instructor.email,
    `Hello ${instructorReportDetails![0].instructor.name} 👋🏻 | Montly Report`,
    filepath,
    `Please find attached monthly report for ${instructorReportDetails![0].month}. 
    Go through the document and keep up the momentum for the next month. we believe in you and our best wishes are with you!`

  )
})

