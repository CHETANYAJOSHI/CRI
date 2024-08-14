const express = require('express');

const {sendOtp , verfiyOtp} = require('../controllers/authController');

const router = express.Router();

router.post('/send-otp' , sendOtp);
router.post('/verify-otp' , verfiyOtp);

module.exports = router;