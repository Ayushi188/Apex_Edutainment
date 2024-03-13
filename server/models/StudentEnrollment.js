const mongoose = require('mongoose');

const studentEnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  enrollmentDate: { type: Date, default: Date.now }
});

const StudentEnrollment = mongoose.model('StudentEnrollment', studentEnrollmentSchema);

module.exports = StudentEnrollment;
