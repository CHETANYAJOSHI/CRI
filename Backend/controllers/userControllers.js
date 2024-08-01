const User = require('../models/createaccount');
const path = require('path');
const fs = require('fs');

const createUser = async (req, res) => {
  try {
    const { accountName, networkHospitalLink } = req.body;

    // Check if files are present
    if (!req.files) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    // const networkHospitalFile = req.files.networkHospitalFile;
    const claimsFile = req.files.claimsFile;
    const exclusionFile = req.files.exclusionFile;
    const checklistFile = req.files.checklistFile;
    const liveDataFile = req.files.liveDataFile;
    const cdStatementFile = req.files.cdStatementFile;
    const claimFormFile = req.files.claimFormFile;
    const claimAnalysisFile = req.files.claimAnalysisFile;
    const claimDumpFile = req.files.claimDumpFile;
    const EndorsementFile = req.files.EndorsementFile;

    // Ensure that files are present
    if (!claimsFile || !exclusionFile || !checklistFile || !liveDataFile || !cdStatementFile || !claimFormFile || !claimAnalysisFile || !claimDumpFile || !EndorsementFile) {
      return res.status(400).json({ message: 'Some files are missing.' });
    }

    // Create a new directory for the account if it doesn't exist
    const accountFolderPath = path.join(__dirname, '../NewAccounts', accountName);
    
    if (!fs.existsSync(accountFolderPath)) {
      fs.mkdirSync(accountFolderPath, { recursive: true });
    }

    // Define file paths
    // const networkHospitalFilePath = path.join(accountFolderPath, networkHospitalFile.name);
    const claimsFilePath = path.join(accountFolderPath, claimsFile.name);
    const exclusionFilePath = path.join(accountFolderPath, exclusionFile.name);
    const checklistFilePath = path.join(accountFolderPath, checklistFile.name);
    const liveDataFilePath = path.join(accountFolderPath, liveDataFile.name);
    const cdStatementFilePath = path.join(accountFolderPath, cdStatementFile.name);
    const claimFormFilePath = path.join(accountFolderPath, claimFormFile.name);
    const claimAnalysisFilePath = path.join(accountFolderPath, claimAnalysisFile.name);
    const claimDumpFilePath = path.join(accountFolderPath, claimDumpFile.name);
    const EndorsementFilePath = path.join(accountFolderPath, EndorsementFile.name);
    // Move files to the account-specific directory
    // networkHospitalFile.mv(networkHospitalFilePath, err => {
    //   if (err) return res.status(500).json({ message: 'Failed to upload network hospital file' });
    // });
    claimsFile.mv(claimsFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload claims file' });
    });
    exclusionFile.mv(exclusionFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload exclusion file' });
    });
    checklistFile.mv(checklistFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload checklist file' });
    });
    liveDataFile.mv(liveDataFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload LiveData file' });
    });
    cdStatementFile.mv(cdStatementFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload cd Statement file' });
    });
    claimFormFile.mv(claimFormFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload ClaimForm file' });
    });
    claimAnalysisFile.mv(claimAnalysisFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload CalimAnalyis file' });
    });
    claimDumpFile.mv(claimDumpFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload ClaimDump file' });
    });
    EndorsementFile.mv(EndorsementFilePath, err => {
      if (err) return res.status(500).json({ message: 'Failed to upload Endorsement file' });
    });

    // Create a new user with relative file paths
    const user = new User({
      accountName,
      networkHospitalLink,
      // networkHospitalFile: path.join(accountName, networkHospitalFile.name),  // Store relative path
      claimsFile: path.join(accountName, claimsFile.name),  // Store relative path
      exclusionFile: path.join(accountName, exclusionFile.name),  // Store relative path
      checklistFile: path.join(accountName, checklistFile.name),  // Store relative path
      liveDataFile: path.join(accountName, liveDataFile.name),  // Store relative path
      cdStatementFile: path.join(accountName, cdStatementFile.name),  // Store relative path
      claimFormFile: path.join(accountName, claimFormFile.name),  // Store relative path
      claimAnalysisFile: path.join(accountName, claimAnalysisFile.name),  // Store relative path
      claimDumpFile: path.join(accountName, claimDumpFile.name),  // Store relative path
      EndorsementFile: path.join(accountName, EndorsementFile.name),  // Store relative path
    });

    await user.save();
    res.json({ message: 'Account created successfully', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser };
