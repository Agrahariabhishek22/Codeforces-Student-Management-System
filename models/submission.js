const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  problemId: {
    type: String, // like "1234/A"
    required: true
  },
  name: {
    type: String, // "Team Name"
    required: true
  },
  rating: {
    type: Number
  },
  verdict: {
    type: String // OK, WRONG_ANSWER, etc.
  },
  timestamp: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);