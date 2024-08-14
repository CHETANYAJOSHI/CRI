const twilio = require('twilio');
require('dotenv').config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID , process.env.TWILIO_AUTH_TOKEN);

exports.sendOtpSMS = (mobileNumber  , otp)=>{
    return client.messages.create({
        body:`Your OTP code is ${otp}`,
        messagingServiceSid: 'MG4a050c7bd651c0822643a1bb676f19c7',
        to:`+91${mobileNumber}`
    });
};