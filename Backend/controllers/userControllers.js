const User = require('../models/createaccount');
const path = require('path');

const createUser = async (req, res) => {
  try {
    const { accountName, networkHospitalLink } = req.body;

    if (!req.files) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const networkHospitalFile = req.files.networkHospitalFile;
    const claimsFile = req.files.claimsFile;
    const exclusionFile = req.files.exclusionFile;
    const checklistFile = req.files.checklistFile;

    // Ensure that files are present
    if (!networkHospitalFile || !claimsFile || !exclusionFile || !checklistFile) {
      return res.status(400).json({ message: 'Some files are missing.' });
    }

    const networkHospitalFilePath = path.join(__dirname, '../NewAccounts', networkHospitalFile.name);
    const claimsFilePath = path.join(__dirname, '../NewAccounts', claimsFile.name);
    const exclusionFilePath = path.join(__dirname, '../NewAccounts', exclusionFile.name);
    const checklistFilePath = path.join(__dirname, '../NewAccounts', checklistFile.name);

    // Move files to server directory
    networkHospitalFile.mv(networkHospitalFilePath, err => {
      if (err) return res.status(500).send(err);
    });
    claimsFile.mv(claimsFilePath, err => {
      if (err) return res.status(500).send(err);
    });
    exclusionFile.mv(exclusionFilePath, err => {
      if (err) return res.status(500).send(err);
    });
    checklistFile.mv(checklistFilePath, err => {
      if (err) return res.status(500).send(err);
    });

    const user = new User({
      accountName,
      networkHospitalLink,
      networkHospitalFile: networkHospitalFilePath,
      claimsFile: claimsFilePath,
      exclusionFile: exclusionFilePath,
      checklistFile: checklistFilePath,
    });

    await user.save();
    res.json({ message: 'Account created successfully', user });
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser };
