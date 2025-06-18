const express = require('express');
const router = express.Router();
const {
  getContestHistory,
  getProblemSolvingStats
} = require('../controllers/profileController');

router.get('/:id/contest-history', getContestHistory);
router.get('/:id/problem-stats', getProblemSolvingStats);

module.exports = router;
