const OTP = require('../models/otpschema');
const Accounts = require('../models/createaccount');
const {generateOTP , generateExpireTime} = require('../utils/otpGenrator');
const {sendOtpSMS} = require("../services/smsService");
require('dotenv').config();
const {generateToken, verifyToken} = require('../utils/jwt');

exports.sendOtp = async(req,res)=>{
    const {mobileNumber} = req.body;

    try{
        const otp = generateOTP();
        const otpExpireAt = generateExpireTime();

        await OTP.findOneAndUpdate(
            {mobileNumber},
            {otp , otpExpireAt},
            {upsert:true , new:true}
        );

        // await sendOtpSMS(mobileNumber , otp);
        res.status(200).json({message:'OTP sent Successfully'});
        
    }

    catch(error){
        console.error(error);
        res.status(500).json({message:'Error Sending OTP'});
    }
}


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
        if (mobileNumber == process.env.ADMIN_NUMBER) {
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

