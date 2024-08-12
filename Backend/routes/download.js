const express = require('express');
const Account = require('../models/createaccount')
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Download a specific file for a given account
router.get('/download/:accountId/:fileType', async (req, res) => {
  try {
    const { accountId, fileType } = req.params;
    
    // Map fileType to the respective file field
    const fileFields = {
      networkHospitalFile: 'networkHospitalFile',
      claimABFile: 'claimABFile',
      exclusionListFile: 'exclusionListFile',
      checkListFile: 'checkListFile'
    };

    // Check if the provided fileType is valid
    if (!fileFields[fileType]) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    // Find the account by ID
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Get the file path from the account object
    const filePath = path.join(__dirname, '../NewAccounts', account[fileFields[fileType]]);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set the headers to initiate download
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
