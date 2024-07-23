const Account = require('../models/createaccount');
const path = require('path');

// Fetch all accounts
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch account data by ID
const getAccountData = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update account data
const updateAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const { accountName, networkHospitalLink } = req.body;
    const files = req.files || {};

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Replace files
    if (files.networkHospitalFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.networkHospitalFile.name);
      files.networkHospitalFile.mv(filePath);
      account.networkHospitalFile = filePath;
    }
    if (files.claimsFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.claimsFile.name);
      files.claimsFile.mv(filePath);
      account.claimsFile = filePath;
    }
    if (files.exclusionFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.exclusionFile.name);
      files.exclusionFile.mv(filePath);
      account.exclusionFile = filePath;
    }
    if (files.checklistFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.checklistFile.name);
      files.checklistFile.mv(filePath);
      account.checklistFile = filePath;
    }

    account.accountName = accountName || account.accountName;
    account.networkHospitalLink = networkHospitalLink || account.networkHospitalLink;

    await account.save();
    res.json({ message: 'Account updated successfully', account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllAccounts, getAccountData, updateAccount };
