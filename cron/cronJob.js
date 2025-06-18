// cron/cronJob.js

const cron = require('node-cron');
const syncAllStudents = require('./syncService');

// Runs every day at 2:00 AM

cron.schedule(process.env.CRON_SCHEDULE, async () => {
  console.log('Running scheduled Codeforces sync...');
  await syncAllStudents();
});
