// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  //courseId: { type: Number, required: true},
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, unique:false },
  uploadedAt: { type: Date, default: Date.now }
});


const File = mongoose.model('File', fileSchema);

module.exports = File;
