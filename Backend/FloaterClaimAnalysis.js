const path = require('path');
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const Accounts = require('./models/createaccount'); // Adjust the path according to your project structure

// Function to fetch and read PDF file
const getClaimFloaterAnalysis = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { accountName, claimFloaterAnalysisFile } = account;
    if (!accountName || !claimFloaterAnalysisFile) {
      return res.status(400).json({ error: 'Invalid account data' });
    }

    const claimFloaterAnalysisFilePath = path.join(__dirname, 'NewAccounts', claimFloaterAnalysisFile);

    if (fs.existsSync(claimFloaterAnalysisFilePath)) {
      res.sendFile(claimFloaterAnalysisFilePath);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to download PDF file
const downloadClaimFloaterAnalysis = async (req, res) => {
  const accountId = req.params.accountId;
  const account = await Accounts.findById(accountId);
  const { claimFloaterAnalysisFile } = account;
  if (!claimFloaterAnalysisFile) {
    return res.status(400).json({ error: 'Invalid account data' });
  }

  if (account) {
    const filePath = path.join(__dirname, './NewAccounts', claimFloaterAnalysisFile);
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

const claimFloaterAnalysisUpload = multer({ storage: pdfStorage });

// Function to upload PDF file
const uploadClaimFloaterAnalysis = async (req, res) => {
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

    // Delete the old claimFloaterAnalysisFile if it exists
    const oldclaimFloaterAnalysisFilePath = path.join(__dirname, 'NewAccounts', account.accountName, account.claimFloaterAnalysisFile);
    if (fs.existsSync(oldclaimFloaterAnalysisFilePath)) {
      fs.unlinkSync(oldclaimFloaterAnalysisFilePath);
    }

    // Update the account with the new claimFloaterAnalysisFile path
    account.claimFloaterAnalysisFile = newFilePath;
    await account.save();

    res.json({ message: 'File uploaded, old file removed, and account updated successfully' });
  } catch (error) {
    console.error('Error uploading file and updating database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
    getClaimFloaterAnalysis,
    downloadClaimFloaterAnalysis,
    uploadClaimFloaterAnalysis,
    claimFloaterAnalysisUpload
};

// Express routes to handle requests

