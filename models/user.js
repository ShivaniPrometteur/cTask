const mongoose = require('mongoose')
const { stringify } = require('querystring')
const userModel = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        minLen: 8,
        maxLen: 15,
        trim:true
    },
    profileImage: {
        type: String,
        required: true,
        trim:true
    }, // s3 link
    phone: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
     
    address: {
        type:String,
        required:true
      
    },
    status:{
        type:String
    },
    token:{
        type:String,
        default:''
    }
}, { timestamps: true })

module.exports = mongoose.model('userc', userModel)