const path = require('path');
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const Accounts = require('./models/createaccount'); // Adjust the path according to your project structure

// Function to fetch and read PDF file
const getrackRatesFile = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { accountName, rackRatesFile } = account;
    if (!accountName || !rackRatesFile) {
      return res.status(400).json({ error: 'Invalid account data' });
    }

    const rackRatesFilePath = path.join(__dirname, 'NewAccounts', rackRatesFile);

    if (fs.existsSync(rackRatesFilePath)) {
      res.sendFile(rackRatesFilePath);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to download PDF file
const downloadrackRatesFile = async (req, res) => {
  const accountId = req.params.accountId;
  const account = await Accounts.findById(accountId);
  const { rackRatesFile } = account;
  if (!rackRatesFile) {
    return res.status(400).json({ error: 'Invalid account data' });
  }

  if (account) {
    const filePath = path.join(__dirname, './NewAccounts', rackRatesFile);
    if (fs.existsSync(filePath)) {
      res.download(filePath, err => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).send('Error downloading file');
        }
      });
    } else {
      res.status(404).send('File not found');
    }
  } else {
    res.status(404).send('Account not found');
  }
};

// Configure Multer for PDF file upload
const pdfStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const accountId = req.params.accountId;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return cb(new Error('Account not found'), false);
    }

    const accountFolder = path.join(__dirname, 'NewAccounts', account.accountName);

    if (!fs.existsSync(accountFolder)) {
      fs.mkdirSync(accountFolder, { recursive: true });
    }

    cb(null, accountFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const rackRatesUpload = multer({ storage: pdfStorage });

// Function to upload PDF file
const uploadrackRatesFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const accountId = req.params.accountId;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const newFilePath = path.join(account.accountName, req.file.originalname);
    const newFileFullPath = path.join(__dirname, 'NewAccounts', newFilePath);

    // Delete the old claimSelfAnalysisFile if it exists
    const oldrackRatesFilePath = path.join(__dirname, 'NewAccounts', account.accountName, account.rackRatesFile);
    if (fs.existsSync(oldrackRatesFilePath)) {
      fs.unlinkSync(oldrackRatesFilePath);
    }

    // Update the account with the new claimSelfAnalysisFile path
    account.rackRatesFile = newFilePath;
    await account.save();

    res.json({ message: 'File uploaded, old file removed, and account updated successfully' });
  } catch (error) {
    console.error('Error uploading file and updating database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getrackRatesFile,
  downloadrackRatesFile,
  uploadrackRatesFile,
  rackRatesUpload
};

// Express routes to handle requests

