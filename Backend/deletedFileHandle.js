const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');
const readxlsxFile = require('read-excel-file/node');
const Accounts = require('./models/createaccount'); // Adjust the path according to your project structure

// Function to fetch and read self-parent data file
const getSelfParentDataFile = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { accountName, deletionDataSelfFile } = account;
    if (!accountName || !deletionDataSelfFile) {
      return res.status(400).json({ error: 'Invalid account data' });
    }

    const selfParentFilePath = path.join(__dirname, 'NewAccounts', deletionDataSelfFile);

    // Read Excel file and send the data
    readxlsxFile(selfParentFilePath).then((rows) => {
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

// Function to download self-parent data file
const downloadSelfParentDataFile = async (req, res) => {
  const accountId = req.params.accountId;
  const account = await Accounts.findById(accountId);
  const { deletionDataSelfFile } = account;
  if (!deletionDataSelfFile) {
    return res.status(400).json({ error: 'Invalid account data' });
  }

  if (account) {
    const filePath = path.join(__dirname, './NewAccounts', deletionDataSelfFile);
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

const selfupload = multer({ storage });

// Function to upload self-parent data file
const uploadSelfParentDataFile = async (req, res) => {
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

    // Delete the old selfParentFile if it exists
    const oldSelfParentFilePath = path.join(__dirname, 'NewAccounts', account.accountName, account.deletionDataSelfFile);
    if (fs.existsSync(oldSelfParentFilePath)) {
      fs.unlinkSync(oldSelfParentFilePath);
    }

    // Update the account with the new selfParentFile path
    account.deletionDataSelfFile = newFilePath;
    await account.save();

    res.json({ message: 'File uploaded, old file removed, and account updated successfully' });
  } catch (error) {
    console.error('Error uploading file and updating database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update a row in the self-parent data file
const updateSelfParentDataRow = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { rowId, updatedData } = req.body;

    if (typeof updatedData !== 'object' || updatedData === null) {
      return res.status(400).json({ error: 'Invalid updatedData format' });
    }

    const account = await Accounts.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { deletionDataSelfFile } = account;
    const filePath = path.join(__dirname, 'NewAccounts', deletionDataSelfFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Read the existing data
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = data[0];
    const rowIndex = parseInt(rowId) + 1; // Adjust for header row

    if (rowIndex < 1 || rowIndex >= data.length) {
      return res.status(400).json({ error: 'Invalid rowId' });
    }

    // Update the row with new data
    headers.forEach((header, index) => {
      if (updatedData.hasOwnProperty(header)) {
        const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: index });
        worksheet[cellAddress] = { v: updatedData[header] || '' };
      }
    });

    // Write the updated workbook back to the file
    xlsx.writeFile(workbook, filePath);

    res.status(200).json({ message: 'Row updated successfully' });
  } catch (error) {
    console.error('Error updating row:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFilePath = (accountName) => path.join(__dirname, 'NewAccounts', accountName, 'Self.xlsx');
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


const AddSelfParentUser = async (req, res) => {
  const { accountId } = req.params;
  const { newRowData } = req.body;

  try {
    const account = await Accounts.findById(accountId);
    const { deletionDataSelfFile } = account;
    const filePath = path.join(__dirname, 'NewAccounts', deletionDataSelfFile);

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
  getSelfParentDataFile,
  downloadSelfParentDataFile,
  uploadSelfParentDataFile,
  updateSelfParentDataRow,
  AddSelfParentUser,
  selfupload
};
