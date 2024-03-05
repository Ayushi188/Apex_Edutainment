const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true 
    }
    
});
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
