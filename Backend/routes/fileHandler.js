const express = require('express');
const Account = require('../models/createaccount')
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const router = express.Router();

// Define your MongoDB schema


// Get the Excel file by account name
router.get('/file/:accountName', async (req, res) => {
  try {
    const { accountName } = req.params;
    const account = await Account.findOne({ accountName });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!account.liveDataFile || typeof account.liveDataFile !== 'string') {
        return res.status(404).json({ message: 'Live data file not found' });
      }

    const filePath = path.join(__dirname, 'NewAccounts', account.accountName, account.liveDataFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath); // Send file to client
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
