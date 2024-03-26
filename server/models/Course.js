// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: Number, required: true, unique: true},
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  imagePath: { type: String, required: false },
  price: { type: String, required: false },
  status: { type: String, required: false, default: 'pending' }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
