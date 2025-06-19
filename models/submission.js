const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  problemId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number
  },
  verdict: {
    type: String
  },
  timestamp: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);