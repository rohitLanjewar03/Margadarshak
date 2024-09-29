const mongoose = require('mongoose');

const User = require('./user'); 

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    courses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course', 
            required: true
        },
        progress: {
            type: Number, 
            required: true,
            default: 0
        },
        grades: [{
            assignmentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Assignment', 
                required: true
            },
            score: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    }],
    attendance: {
        totalClasses: {
            type: Number,
            default: 0
        },
        classesAttended: {
            type: Number,
            default: 0
        },
        attendancePercentage: {
            type: Number,
            default: 0
        }
    },
    created_on: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);
