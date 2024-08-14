exports.generateOTP = () =>{
    return Math.floor(100000+Math.random()*900000).toString();
}

exports.generateExpireTime=()=>{
    return new Date(Date.now() + 2 * 60000); // OTP Valid for 2 minutes
}