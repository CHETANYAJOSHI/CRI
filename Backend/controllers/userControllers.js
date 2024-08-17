const User = require('../models/createaccount');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const nodemailer = require('nodemailer');
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const accountFolderPath = path.join(__dirname, '../NewAccounts', req.body.accountName);
    if (!fs.existsSync(accountFolderPath)) {
      fs.mkdirSync(accountFolderPath, { recursive: true });
    }
    cb(null, accountFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const createUser = async (req, res) => {
  try {
    const { accountName, networkHospitalLink , TPAName , InsuranceName, hrName , hrEmail , hrNumber  } = req.body;

    // Check if files are present
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const files = req.files;
    const requiredFiles = [
      'cdStatementFile', 'claimSelfAnalysisFile', 'claimFloaterAnalysisFile', 'claimDumpSelfFile', 
      'claimDumpFloaterFile', 'liveDataSelfFile', 'liveDataFloaterFile', 
      'claimABFile', 'checkListFile','exclusionListFile',
      'additionDataFile','deletionDataFile','policyCoverageSelfFile','policyCoverageFloaterFile'
    ];

    for (const file of requiredFiles) {
      if (!files[file]) {
        return res.status(400).json({ message: "file missing"});
      }
    }

    const trasnporter = nodemailer.createTransport({
      service:'Gmail',
      auth:{
        user:'chetanyajoshi9654@gmail.com',
        pass:"uale nfrb oqjp joga"
      }
    })

    const sendEmail = async (hrEmail , hrName , accountName , hrNumber)=>{
      const mailOptions={
        from : "chetanyajoshi9654@gmail.com",
        to:hrEmail,
        subject:"Account Created Successfully",
        text : `Hello ${hrName}, \n\nYour account for ${accountName} has been successfully created \n\nNow you can Login with this Number ${hrNumber} \n\nThank You`
      };

      try{
        await trasnporter.sendMail(mailOptions);
        console.log("Email Sent Successfully");
      }catch(e){
          console.log('Error sending email' ,e);
      }
    }

    // Create a new user with relative file paths
    const user = new User({
      accountName,
      networkHospitalLink,
      TPAName,
      InsuranceName,
      hrName,
      hrEmail,
      hrNumber,
      // corporateName,
      cdStatementFile: path.join(accountName, files.cdStatementFile[0].originalname),
      claimSelfAnalysisFile: path.join(accountName, files.claimSelfAnalysisFile[0].originalname),
      claimFloaterAnalysisFile: path.join(accountName, files.claimFloaterAnalysisFile[0].originalname),
      claimDumpSelfFile: path.join(accountName, files.claimDumpSelfFile[0].originalname),
      claimDumpFloaterFile: path.join(accountName, files.claimDumpFloaterFile[0].originalname),
      liveDataSelfFile: path.join(accountName, files.liveDataSelfFile[0].originalname),
      liveDataFloaterFile: path.join(accountName, files.liveDataFloaterFile[0].originalname),
      // endrosementSelfFile: path.join(accountName, files.endrosementSelfFile[0].originalname),
      // endrosementFloaterFile: path.join(accountName, files.endrosementFloaterFile[0].originalname),
      claimABFile: path.join(accountName, files.claimABFile[0].originalname),
      checkListFile: path.join(accountName, files.checkListFile[0].originalname),
      exclusionListFile: path.join(accountName, files.exclusionListFile[0].originalname),
      // deletionDataSelfFile: path.join(accountName, files.deletionDataSelfFile[0].originalname),
      additionDataFile: path.join(accountName, files.additionDataFile[0].originalname),
      // additionDataSelfFile: path.join(accountName, files.additionDataSelfFile[0].originalname),
      deletionDataFile: path.join(accountName, files.deletionDataFile[0].originalname),
      policyCoverageSelfFile: path.join(accountName, files.policyCoverageSelfFile[0].originalname),
      policyCoverageFloaterFile: path.join(accountName, files.policyCoverageFloaterFile[0].originalname),
            
    });

    await sendEmail(hrEmail , hrName , accountName , hrNumber)

    await user.save();
    res.json({ message: 'Account created successfully', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser, upload };