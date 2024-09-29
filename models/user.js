const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/margadarshak');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    contact:{
        type:Number,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model('User',userSchema);