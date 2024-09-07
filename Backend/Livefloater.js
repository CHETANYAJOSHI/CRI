const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');
const readxlsxFile = require('read-excel-file/node');
const Accounts = require('./models/createaccount'); // Adjust the path according to your project structure

// Function to fetch and read floater-parent data file
const getFloaterLive = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { accountName, liveDataFloaterFile } = account;
    if (!accountName || !liveDataFloaterFile) {
      return res.status(400).json({ error: 'Invalid account data' });
    }

    const floaterParentFilePath = path.join(__dirname, 'NewAccounts', liveDataFloaterFile);

    // Read Excel file and send the data
    readxlsxFile(floaterParentFilePath).then((rows) => {
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

const getSpecificSelfFloaterFile = async(req,res)=>{
  try {
    const accountId = req.params.id;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { accountName, liveDataFloaterFile } = account;
    if (!accountName || !liveDataFloaterFile) {
      return res.status(400).json({ error: 'Invalid account data' });
    }

    const liveDataFilePath = path.join(__dirname, 'NewAccounts', liveDataFloaterFile);

    // Read Excel file and filter specific headers
    readxlsxFile(liveDataFilePath)
      .then((rows) => {
        const headers = rows[0];
        const requiredHeaders = ['Active live', 'Total Preimium', 'Name of TPA', 'CD Balance'];
        
        // Get the indices of the required headers
        const indices = headers.reduce((acc, header, index) => {
          if (requiredHeaders.includes(header)) {
            acc.push(index);
          }
          return acc;
        }, []);
        
        // If none of the required headers are found, return an error
        if (indices.length === 0) {
          return res.status(400).json({ error: 'Required headers not found in the Excel file' });
        }

        // Filter the rows to include only the required columns
        const filteredData = rows.slice(1).map((row) => {
          let rowData = {};
          indices.forEach((index) => {
            rowData[headers[index]] = row[index];
          });
          return rowData;
        });

        // Send the filtered data and headers
        const filteredHeaders = indices.map(index => headers[index]);
        res.json({ headers: filteredHeaders, data: filteredData });
      })
      .catch((error) => {
        console.error('Error reading Excel file:', error);
        res.status(500).json({ error: 'Failed to read Excel file' });
      });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



// Function to download floater-parent data file
const downloadFloaterLive = async (req, res) => {
  const accountId = req.params.accountId;
  const account = await Accounts.findById(accountId);
  const { liveDataFloaterFile } = account;
  if (!liveDataFloaterFile) {
    return res.status(400).json({ error: 'Invalid account data' });
  }

  if (account) {
    const filePath = path.join(__dirname, './NewAccounts', liveDataFloaterFile);
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

const floaterUploadLive = multer({ storage });

// Function to upload floater-parent data file
const uploadFloaterLive = async (req, res) => {
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

    // Delete the old floaterParentFile if it exists
    const oldFloaterParentFilePath = path.join(__dirname, 'NewAccounts', account.accountName, account.liveDataFloaterFile);
    if (fs.existsSync(oldFloaterParentFilePath)) {
      fs.unlinkSync(oldFloaterParentFilePath);
    }

    // Update the account with the new floaterParentFile path
    account.liveDataFloaterFile = newFilePath;
    await account.save();

    res.json({ message: 'File uploaded, old file removed, and account updated successfully' });
  } catch (error) {
    console.error('Error uploading file and updating database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update a row in the floater-parent data file
const updateFloaterLive = async (req, res) => {
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

    const { liveDataFloaterFile } = account;
    const filePath = path.join(__dirname, 'NewAccounts', liveDataFloaterFile);

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


const AddFloaterLive = async (req, res) => {
  const { accountId } = req.params;
  const { newRowData } = req.body;

  try {
    const account = await Accounts.findById(accountId);
    const { liveDataFloaterFile } = account;
    const filePath = path.join(__dirname, 'NewAccounts', liveDataFloaterFile);

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



const countBenefStatus = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { liveDataFloaterFile } = account;
    if (!liveDataFloaterFile) {
      return res.status(400).json({ error: 'Invalid account data' });
    }

    const filePath = path.join(__dirname, 'NewAccounts', liveDataFloaterFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Find the index of the 'benef_status' column
    const headers = rows[0];
    const benefStatusIndex = headers.indexOf('benef_status');

    if (benefStatusIndex === -1) {
      return res.status(400).json({ error: "'benef_status' column not found" });
    }

    let activeCount = 0;
    let inactiveCount = 0;

    rows.slice(1).forEach(row => {
      const status = row[benefStatusIndex];
      if (status === 'ACTIVE') {
        activeCount++;
      } else if (status === 'Inactive') {
        inactiveCount++;
      }
    });

    res.json({ activeCount, inactiveCount });
  } catch (error) {
    console.error('Error counting benef_status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
    getFloaterLive,
    downloadFloaterLive,
    uploadFloaterLive,
    updateFloaterLive,
    AddFloaterLive,
    getSpecificSelfFloaterFile,
    floaterUploadLive,
    countBenefStatus,
};
