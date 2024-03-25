const mongoose = require('mongoose');
const { Schema } = mongoose; 

const videoSubmissionSchema = new Schema({
    videoUrl: {
        type: String,
        required: false
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true,
        unique : false
    },
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false 
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }

});

const VideoSubmission = mongoose.model('VideoSubmission', videoSubmissionSchema);

module.exports = VideoSubmission;
