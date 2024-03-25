const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  courseId:String,
  questions: [{
    text: String,
    image: String, // Store image URL
    options: [String],
    correctOptionIndex: Number
  }]
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
