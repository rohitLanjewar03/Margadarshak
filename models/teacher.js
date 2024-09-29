const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    coursesTaught: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' // Reference to Course schema
    }],
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);
