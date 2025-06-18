const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  contestId: {
    type: Number,
    required: true
  },
  contestName: {
    type: String,
    required: true
  },
  rank: {
    type: Number
  },
  oldRating: {
    type: Number
  },
  newRating: {
    type: Number
  },
  ratingChange: {
    type: Number
  },
  date: {
    type: Date,
    required: true
  },
  unsolvedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);
