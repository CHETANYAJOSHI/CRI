const OTP = require('../models/otpschema');
const Accounts = require('../models/createaccount');
const {generateOTP , generateExpireTime} = require('../utils/otpGenrator');
const axios = require('axios');

// const {sendOtpSMS} = require("../services/smsService");
require('dotenv').config();
const {generateToken, verifyToken} = require('../utils/jwt');


const sendOtpSMS = async (mobileNumber, otp) => {
    try {
        const apiUrl = `https://msg.smsguruonline.com/fe/api/v1/send`;
        const params = {
            username: process.env.SMS_API_USERNAME,
            password: process.env.SMS_API_PASSWORD,
            unicode: 'false',
            from: process.env.SMS_FROM,
            to: mobileNumber, // Use the formatted mobile number
            dltPrincipalEntityId: process.env.DLT_PRINCIPAL_ENTITY_ID,
            dltContentId: process.env.DLT_CONTENT_ID,
            text: `Dear ${'Family'}, Your One time password OTP is: ${otp},Thanks!! - Corporate Risks India Insurance Brokers Pvt. Ltd`
        };

        // Log for debugging
        console.log(`Sending SMS to ${mobileNumber} with URL: ${apiUrl}?${new URLSearchParams(params)}`);

        const response = await axios.get(apiUrl, { params });
        console.log('SMS API Response:', response.data);
    } catch (error) {
        console.error('Error sending OTP:', error.response ? error.response.data : error.message);
    }
};







exports.sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;
    console.log('Received mobile number:', mobileNumber); // For debugging

    try {
        const otp = generateOTP(); // Generate OTP
        const otpExpireAt = generateExpireTime(); // Expiration time

        // Save OTP to the database...

         // Save OTP and its expiration time in the database
         await OTP.findOneAndUpdate(
            { mobileNumber },
            { otp, otpExpireAt },
            { upsert: true, new: true }
        );

        // Send OTP via SMS
        // await sendOtpSMS(mobileNumber, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};


exports.verfiyOtp = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    try {
        const user = await OTP.findOne({ mobileNumber });

        if (!user) {
            return res.status(400).json({ message: 'User not Found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpireAt < Date.now()) {
            return res.status(400).json({ message: 'OTP Expired' });
        }

                let role = "";

                // Check if the user is an Admin
                const adminNumbers = process.env.ADMIN_NUMBERS.split(',');

        if (adminNumbers.includes(mobileNumber)) {
            role = "Admin";
            const token = generateToken({ mobileNumber, role }); // Generate JWT for the Admin
            return res.status(200).json({ message: 'Admin Login', role, token });
        }

        // Check if the user is an HR
        const hrRecord = await Accounts.find({ hrNumber: mobileNumber });

        if (hrRecord.length > 0) { // If the HR record exists
            role = "HR";
            const token = generateToken({ mobileNumber, role });

            const hrDetails = hrRecord.map(record => ({
                hrName: record.hrName,
                accountName: record.accountName,
                hrId: record._id,
                hrNumber: record.hrNumber
            }));

            return res.status(200).json({
                message: 'OTP Verified Successfully',
                hrDetails, // Returning an array of HR details
                token,
                role,
            });
        }

        // If the user is neither Admin nor HR, assign them the Employee role
        role = "Employee";
        const token = generateToken({ mobileNumber, role });

        return res.status(200).json({
            message: 'OTP Verified Successfully',
            mobileNumber, // Including mobileNumber in the response
            token,
            role,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error Verifying OTP' });
    }
};



exports.authenticateAdmin = (req , res , next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:'Access Denied'});
    }

    try{
        const decoded = verifyToken(token);
        if(decoded.role !== 'Admin'){
            return res.status(403).json({message:"Access Denied Insufficient Permissions"});
        }
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(401).json({message:"Invalid token"});
    }
}

