// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: Number, required: true, unique: true},
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  imagePath: { type: String, required: false }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
