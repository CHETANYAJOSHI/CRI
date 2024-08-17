const OTP = require('../models/otpschema');
const Accounts = require('../models/createaccount');
const {generateOTP , generateExpireTime} = require('../utils/otpGenrator');
const {sendOtpSMS} = require("../services/smsService");
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

        await sendOtpSMS(mobileNumber , otp);
        res.status(200).json({message:'OTP sent Successfully'});
        
    }

    catch(error){
        console.error(error);
        res.status(500).json({message:'Error Sending OTP'});
    }
}


exports.verfiyOtp = async (req,res) => {
    const {mobileNumber , otp} = req.body;

    try{
        const user = await OTP.findOne({mobileNumber});

        if(!user){
            return res.status(400).json({message:'User not Found'});
        }

        if(user.otp !== otp){
            return res.status(400).json({message:'Invalid OTP'});
        }

        if(user.otpExpireAt < Date.now()){
            return res.status(400).json({message:'OTP Expired'});
        }
        let role = "";
        if(mobileNumber == "8744959397"){
            role="Admin";
            const token = generateToken({mobileNumber , role}); //Generate JWT For the Admin
            return res.status(200).json({message:'Admin Login' , role , token});
        }

        const hrRecord = await Accounts.findOne({hrNumber : mobileNumber});

        if(!hrRecord){
            return res.status(403).json({message:"Access Denied: Not an HR"})
        }

        //OTP Verfied Successfully
        role="HR";
        const token = generateToken({mobileNumber , role});
        res.status(200).json({
        message: 'OTP Verified Successfully',
        hrName: hrRecord.hrName,
        accountName: hrRecord.accountName,
        hrId: hrRecord._id, // Sending the _id in the response
        token,
        role
      });

    }

    catch(error){
        console.log(error);
        res.status(500).json({message:'Error Verifying OTP'});
    }
}


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

