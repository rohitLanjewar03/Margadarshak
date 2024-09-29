const mongoose = require('mongoose');

const Teacher = require('./teacher'); 

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', 
        required: true
    },
    studentsEnrolled: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student' // Reference to the Student schema
        }
    }],
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment' // Reference to Assignment schema
    }],
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
