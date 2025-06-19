const axios = require('axios');
const Student = require('../models/student');
const Submission = require('../models/submission');
const Contest = require('../models/contest');
const toDate=(seconds)=>new Date(seconds*1000);

// Main function to sync data for a student
const syncStudentFromCodeforces = async (student) => {
  try {
    const handle = student.cfHandle;

    // Fetch user.info
    const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    const info = infoRes.data.result[0];
    // console.log(info);
    

    // Update rating info
    student.currentRating = info.rating || 0;
    student.maxRating = info.maxRating || 0;
    student.lastSynced = new Date();
    await student.save();
    // console.log(student);
    
    // Fetch user.rating (contest history)
    const ratingRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const contests = ratingRes.data.result;

    // Remove old contests for this student
    await Contest.deleteMany({ studentId: student._id });

    const contestDocs = contests.map(c => ({
      studentId: student._id,
      contestId: c.contestId,
      contestName: c.contestName,
      rank: c.rank,
      oldRating: c.oldRating,
      newRating: c.newRating,
      ratingChange: c.newRating - c.oldRating,
      date: toDate(c.ratingUpdateTimeSeconds)
    }));

    await Contest.insertMany(contestDocs);

    // Fetch user.status (submissions)
    const statusRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`);
    const submissions = statusRes.data.result;

    // Remove old submissions for this student
    await Submission.deleteMany({ studentId: student._id });
    console.log("This is submission data");
    console.log(submissions);
    
    const submissionDocs = submissions
      .filter(s => s.problem && s.verdict)
      .map(s => ({
        studentId: student._id,
        problemId: `${s.problem.contestId}/${s.problem.index}`,
        name: s.problem.name,
        contestId: s.contestId,
        index: s.problem.index,
        rating: s.problem.rating || null,
        verdict: s.verdict,
        language: s.programmingLanguage,
        tags: s.problem.tags || [],
        timestamp: toDate(s.creationTimeSeconds)
      }));
      // console.log(submissionDocs);
      

    await Submission.insertMany(submissionDocs);

    console.log(`Synced Codeforces data for ${student.name}`);
  } catch (err) {
    console.error(`Failed to sync CF data for ${student.name}:`, err.message);
  }
};

module.exports = syncStudentFromCodeforces;
