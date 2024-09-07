const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,   
    },
    otpExpireAt:{
        type:Date,
        default:Date.now,
        expires:0
    }
})

module.exports = mongoose.model('OTP' , OtpSchema);