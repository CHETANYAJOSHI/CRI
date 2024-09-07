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
      // 'cdStatementFile',  'claimFloaterAnalysisFile',  
      // 'claimDumpFloaterFile', 'liveDataFloaterFile', 
      // 'claimABFile', 'checkListFile','exclusionListFile',
      // 'additionDataFile','deletionDataFile','policyCoverageFloaterFile'
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
      cdStatementFile: files.cdStatementFile ? path.join(accountName, files.cdStatementFile[0].originalname) : null,
      claimSelfAnalysisFile: files.claimSelfAnalysisFile ? path.join(accountName, files.claimSelfAnalysisFile[0].originalname) : null,
      claimFloaterAnalysisFile: files.claimFloaterAnalysisFile ? path.join(accountName, files.claimFloaterAnalysisFile[0].originalname) : null,
      claimDumpSelfFile: files.claimDumpSelfFile ? path.join(accountName, files.claimDumpSelfFile[0].originalname) : null,
      claimDumpFloaterFile: files.claimDumpFloaterFile ? path.join(accountName, files.claimDumpFloaterFile[0].originalname) : null,
      liveDataSelfFile: files.liveDataSelfFile ? path.join(accountName, files.liveDataSelfFile[0].originalname) : null,
      liveDataFloaterFile: files.liveDataFloaterFile ? path.join(accountName, files.liveDataFloaterFile[0].originalname) : null,
      claimABFile: files.claimABFile ? path.join(accountName, files.claimABFile[0].originalname) : null,
      rackRatesFile: files.rackRatesFile ? path.join(accountName, files.rackRatesFile[0].originalname) : null,
      
      checkListFile: files.checkListFile ? path.join(accountName, files.checkListFile[0].originalname) : null,
      exclusionListFile: files.exclusionListFile ? path.join(accountName, files.exclusionListFile[0].originalname) : null,
      additionDataFile: files.additionDataFile ? path.join(accountName, files.additionDataFile[0].originalname) : null,
      deletionDataFile: files.deletionDataFile ? path.join(accountName, files.deletionDataFile[0].originalname) : null,
      policyCoverageSelfFile: files.policyCoverageSelfFile ? path.join(accountName, files.policyCoverageSelfFile[0].originalname) : null,
      policyCoverageFloaterFile: files.policyCoverageFloaterFile ? path.join(accountName, files.policyCoverageFloaterFile[0].originalname) : null
            
    });

    await sendEmail(hrEmail , hrName , accountName , hrNumber)

    await user.save();
    res.json({ message: 'Account created successfully', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeUniqueIndex = async () => {
  try {
    await User.collection.dropIndex('hrNumber_1' , 'hrEmail_1');
    
    console.log('Unique index on hrNumber removed successfully');
  } catch (error) {
    console.error('Error removing unique index:', error);
  }
};
const removeUniqueIndex1 = async () => {
  try {
    await User.collection.dropIndex('hrEmail_1');
    
    console.log('Unique index on hrNumber removed successfully');
  } catch (error) {
    console.error('Error removing unique index:', error);
  }
};
const removeUniqueIndex3 = async () => {
  try {
    await User.collection.dropIndex('accountName_1');
    
    console.log('Unique index on hrNumber removed successfully');
  } catch (error) {
    console.error('Error removing unique index:', error);
  }
};
removeUniqueIndex();
removeUniqueIndex1();
removeUniqueIndex3();

module.exports = { createUser, upload };