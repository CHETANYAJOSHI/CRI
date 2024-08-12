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
   
    if (files.claimABFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.claimABFile.name);
      files.claimABFile.mv(filePath);
      account.claimABFile = filePath;
    }
    if (files.exclusionListFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.exclusionListFile.name);
      files.exclusionListFile.mv(filePath);
      account.exclusionListFile = filePath;
    }
    if (files.checklistFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.checklistFile.name);
      files.checklistFile.mv(filePath);
      account.checklistFile = filePath;
    }
    if (files.liveDataFile) {
      const filePath = path.join(__dirname, '../NewAccounts', files.liveDataFile.name);
      files.liveDataFile.mv(filePath);
      account.liveDataFile = filePath;
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


const getLiveDataFilePath = async (accountId) => {
  const account = await Account.findById(accountId);
  if (!account || !account.liveDataFile) {
    throw new Error('Account or liveDataFile not found');
  }
  return path.join(__dirname, '..', 'NewAccounts', account.accountName, account.liveDataFile);
};

// Function to read Excel data from the first sheet
const claimdumexcel = async (accountId) => {
  const filePath = await getLiveDataFilePath(accountId);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const xlData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });
  return xlData;
};

// Handler to fetch data from Excel file
const claimdumpdatahandler = async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const xlData = await claimdumexcel(accountId);
    const headers = xlData[0];
    const data = xlData.slice(1);
    res.json({ headers, data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};


module.exports = { getAllAccounts, getAccountData, updateAccount,claimdumpdatahandler };
