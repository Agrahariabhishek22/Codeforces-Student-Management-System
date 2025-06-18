// cron/syncService.js
const Student = require('../models/student');
const syncStudentFromCodeforces = require('../services/codeforcesService');
const Submission = require('../models/submission');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');

const getDateDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const syncAllStudents = async () => {
  try {
    const students = await Student.find();

    for (const student of students) {
      console.log(`Syncing ${student.name}...`);
      await syncStudentFromCodeforces(student);

      // Inactivity check
      const recentSubmission = await Submission.findOne({
        studentId: student._id,
        timestamp: { $gte: getDateDaysAgo(7) }
      });

      if(!recentSubmission && student.isAutoMailEnabled) {
        console.log(`${student.name} is inactive. Sending reminder...`);

        await sendEmail({
          to: student.email,
          subject: 'Stay Sharp on Codeforces ',
          html: `
            <p>Hey ${student.name},</p>
            <p>We noticed you haven't solved any problems in the last 7 days.</p>
            <p>Keep up the grind – even one problem a day counts!</p>
            <p>Good luck </p>
          `
        });

        // Increment reminder count
        student.inactiveReminderCount += 1;
        await student.save();
      }
    }

    console.log(`All students synced at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error('Sync error:', err.message);
  }
};

module.exports = syncAllStudents;
