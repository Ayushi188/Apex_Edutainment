const mongoose = require('mongoose');

const FeedbackFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  file: {
    type: String, 
    required: false, 
  }
});

const FeedbackForm = mongoose.model('FeedbackForm', FeedbackFormSchema);

module.exports = FeedbackForm;
