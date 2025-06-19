const Submission = require('../models/submission');
const Contest = require('../models/contest');
const mongoose = require('mongoose');

const getDateDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

// 1. Contest History
const getContestHistory = async (req, res) => {
  try {
    const { id } = req.params; // studentId
    const days = parseInt(req.query.days) || 365;
    // console.log(id,days);
    
    const fromDate = getDateDaysAgo(days);

    const contests = await Contest.find({
      studentId: id,
      date: { $gte: fromDate }
    }).sort({ date: 1 });

    // Rating graph
    const ratingGraph = contests.map(c => ({
      date: c.date,
      rating: c.newRating
    }));

    const response = {
      contests,
      ratingGraph
    };

    res.status(200).json({ success: true,
      message: "Contest history fetched successfully",
       data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Problem Solving Stats
const getProblemSolvingStats = async (req, res) => {
  try {
    const { id } = req.params; // studentId
    const days = parseInt(req.query.days) || 30;

    const fromDate = getDateDaysAgo(days);

    const submissions = await Submission.find({
      studentId: id,
      verdict: 'OK',
      timestamp: { $gte: fromDate }
    });
    console.log("my submissions"+submissions)
    

    if (!submissions.length) {
      return res.status(200).json({
        success: true,
        data: {
          totalSolved: 0,
          avgRating: 0,
          avgPerDay: 0,
          hardestProblem: null,
          ratingBuckets: {},
          heatmap: []
        }
      });
    }

    // Total solved
    const totalSolved = submissions.length;

    // Average rating
    const rated = submissions.filter(s => s.rating);
    const avgRating = rated.length
      ? Math.round(rated.reduce((acc, s) => acc + s.rating, 0) / rated.length)
      : 0;

    // Most difficult problem
    const hardestProblem = rated.sort((a, b) => b.rating - a.rating)[0];

    // Avg per day
    const avgPerDay = +(totalSolved / days).toFixed(2);

    // Bar Chart: Problems per rating bucket
    const ratingBuckets = {}; // e.g. { '800': 5, '900': 3 }

    rated.forEach(sub => {
      const bucket = Math.floor(sub.rating / 100) * 100;
      ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;
    });

    // Heatmap: { 'YYYY-MM-DD': count }
    const heatmap = {};
    submissions.forEach(sub => {
      const dateStr = sub.timestamp.toISOString().split('T')[0];
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalSolved,
        avgRating,
        avgPerDay,
        hardestProblem,
        ratingBuckets,
        heatmap
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getContestHistory,
  getProblemSolvingStats
};
