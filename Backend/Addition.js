const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');
const readxlsxFile = require('read-excel-file/node');
const Accounts = require('./models/createaccount'); // Adjust the path according to your project structure
const fileNotificationSchema = require('./models/FileChangeNotification');

// Function to fetch and read claims data file
const getAdditionDataFile = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({error:'Account not found'});
    }

    const { accountName, additionDataFile } = account;
    if (!accountName || !additionDataFile) {
      return res.status(400).json({ error: 'Invalid account data' });
    }

    const claimsFilePath = path.join(__dirname, 'NewAccounts', additionDataFile);

    // Read Excel file and send the data
    readxlsxFile(claimsFilePath).then((rows) => {
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        let rowData = {};
        row.forEach((cell, index) => {
          rowData[headers[index]] = cell;
        });
        return rowData;
      });

      res.json({ headers, data });
    }).catch(error => {
      console.error('Error reading Excel file:', error);
      res.status(500).json({ error: 'Failed to read Excel file' });
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to download claims data file
const downloadAdditionDataFile = async (req, res) => {
  const accountId = req.params.accountId;
  const account = await Accounts.findById(accountId);
  const { additionDataFile } = account;
  if (!additionDataFile) {
    return res.status(400).json({ error: 'Invalid account data' });
  }

  if (account) {
    const filePath = path.join(__dirname, './NewAccounts', additionDataFile);
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

// Configure Multer for file upload
const storage = multer.diskStorage({
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

const Additionupload = multer({ storage });

// Function to upload claims data file
const uploadAdditionDataFile = async (req, res) => {
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

    // Delete the old claimsFile if it exists
    const oldClaimsFilePath = path.join(__dirname, 'NewAccounts', account.accountName, account.additionDataFile);
    if (fs.existsSync(oldClaimsFilePath)) {
      fs.unlinkSync(oldClaimsFilePath);
    }

    // Update the account with the new claimsFile path
    account.additionDataFile = newFilePath;
    await account.save();

    const notification = new fileNotificationSchema({
      type: 'file_upload',
      message: `A new file has been uploaded for account: ${account.accountName}. File path: ${newFilePath}.`
    });
    await notification.save();

    res.json({ message: 'File uploaded, old file removed, and account updated successfully' });
  } catch (error) {
    console.error('Error uploading file and updating database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await fileNotificationSchema.find().sort({ date: -1 }); // Fetches notifications in descending order
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update a row in the claims data file
const updateAdditionDataRow = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the entire request body

    const { accountId } = req.params;
    const { rowId, updatedData } = req.body;

    console.log(`Received accountId: ${accountId}`);
    console.log(`Received rowId: ${rowId}`);
    console.log('Received updatedData:', updatedData);

    if (typeof updatedData !== 'object' || updatedData === null) {
      return res.status(400).json({ error: 'Invalid updatedData format' });
    }

    const account = await Accounts.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { additionDataFile } = account;
    const filePath = path.join(__dirname, 'NewAccounts', additionDataFile);

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    console.log('Excel rows:', rows);

    if (rowId < 0 || rowId >= rows.length - 1) {
      return res.status(400).json({ error: 'Invalid rowId' });
    }

    const headers = rows[0];
    const rowIndex = parseInt(rowId) + 1;

    console.log('Headers:', headers);

    headers.forEach((header, index) => {
      if (updatedData.hasOwnProperty(header)) {
        const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: index });
        worksheet[cellAddress] = { v: updatedData[header] || '' };
      } else {
        console.warn(`Header '${header}' not found in updatedData.`);
      }
    });

    xlsx.writeFile(workbook, filePath);

    res.status(200).json({ message: 'Row updated successfully' });
  } catch (error) {
    console.error('Error updating row:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getDataFromSheet = (sheet) => {
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const headers = data[0];
  const rows = data.slice(1).map((row) => {
    const rowData = [];
    headers.forEach((header, i) => {
      rowData.push(row[i]);
    });
    return rowData;
  });
  return { headers, rows };
};



const AddSelfAddition = async (req, res) => {
  const { accountId } = req.params;
  const { newRowData } = req.body;

  try {
    const account = await Accounts.findById(accountId);
    const { additionDataFile } = account;
    const filePath = path.join(__dirname, 'NewAccounts', additionDataFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const { headers, rows } = getDataFromSheet(worksheet);

    // Append the new row data
    const newRow = headers.map((header) => newRowData[header] || '');
    rows.push(newRow);

    // Convert back to sheet and write to file
    const newSheetData = [headers, ...rows];
    const newWorksheet = xlsx.utils.aoa_to_sheet(newSheetData);
    workbook.Sheets[sheetName] = newWorksheet;
    xlsx.writeFile(workbook, filePath);

    res.status(200).json({ message: 'Row added successfully' });
  } catch (error) {
    console.error('Error adding new row:', error);
    res.status(500).json({ message: 'Error adding new row' });
  }
};


module.exports = {
    getAdditionDataFile,
    downloadAdditionDataFile,
    uploadAdditionDataFile,
    updateAdditionDataRow,
    AddSelfAddition,
    getNotifications,
    Additionupload
};
