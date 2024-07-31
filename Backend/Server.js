const express = require('express');
const cors = require('cors');
const path = require('path');
const xlsx = require('xlsx');

const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes');
const accountRouters = require('./routes/accountRoutes');
const Accounts= require('./models/createaccount');
const Account=require('./routes/download');
const multer = require('multer');

const readxlsxFile = require('read-excel-file/node');
// const fileUpload = require('express-fileupload');
const moment = require('moment');
const fs = require('fs');
const { embedPdfInExcel } = require('./processexcel');
const app = express();
const PORT = 5000;
const FILE_PATH = path.join(__dirname, 'uploads', 'data.xlsx');
const { getDeletedDataHandler, updateRowHandler, deleteRowHandler , selfDownload, selfUpload ,selfupload} = require('./deletedFileHandle');
const { getfloatDeletedDataHandler, floatupdateRowHandler, floatdeleteRowHandler ,floaterDownload, floaterUpload ,floaterupload } = require('./floaterDeleted');
const {claimdumpdatahandler, updateclaimdump, claimdumpdownload, claimdumpupload, claimdump}= require("./claimdump");
const {rackdatahandler,updaterack,rackdownload,rackupload,rack}= require("./rackrates");
const pdfRouter = require('./pdfHandler');

require('dotenv').config();

const connectDB = require('./config');

// app.use(fileUpload());
connectDB();
app.use(cors());

app.use(bodyParser.json());


app.use('/api/files' , Account)
app.use('/api' , accountRouters)

// app.use('/api', userRoutes);



app.get('/process-excel', (req, res) => {
    const excelFilePath = path.join(__dirname, 'file', 'data.xlsx'); // Update this path
    const pdfFolderPath1 = path.join(__dirname, 'Employee, Family & Parents'); // Update this path
    const outputFilePath = path.join(__dirname, 'updatefile', 'data.xlsx'); // Update this path
    const pdfFolderPath2 = path.join(__dirname, 'Employee and Parents')
    try {
        processExcel(excelFilePath, pdfFolderPath1,pdfFolderPath2, outputFilePath);
        res.send('Excel file processed and updated with PDF links.');
    } catch (error) {
        console.error('Error processing Excel file:', error);
        res.status(500).send('Error processing Excel file.');
    }
});

// Middleware



app.use('/pdf', pdfRouter);
app.get('/api/deleted-data', getDeletedDataHandler);
app.put('/api/update-row/:rowIndex', updateRowHandler);
app.delete('/api/delete-row/:rowIndex', deleteRowHandler);
app.get('/api/selfdownload-file', selfDownload);
app.post('/api/selfupload-file',selfupload.single('file'), selfUpload);

// floated deleted
app.get('/api/floatdeleted-data', getfloatDeletedDataHandler);
app.put('/api/floatupdate-row/:rowIndex', floatupdateRowHandler);
app.delete('/api/floatdelete-row/:rowIndex', floatdeleteRowHandler);
app.get('/api/floaterdownload-file', floaterDownload);
app.post('/api/floaterupload-file',floaterupload.single('file'), floaterUpload);


//claimdump
app.get('/api/claimdumpexcel', claimdumpdatahandler);
app.put('/api/claimdumpupdate/:rowIndex', updateclaimdump);
// app.delete('/api/floatdelete-row/:rowIndex', floatdeleteRowHandler);
app.get('/api/claimdumpdownload-file', claimdumpdownload);
app.post('/api/claimdumpupload-file',claimdump.single('file'), claimdumpupload);


app.get('/api/rackexcel', rackdatahandler);
app.put('/api/rackupdate/:rowIndex', updaterack);
// app.delete('/api/floatdelete-row/:rowIndex', floatdeleteRowHandler);
app.get('/api/rackdownload-file', rackdownload);
app.post('/api/rackupload-file',rack.single('file'), rackupload);


// try this

app.get('/api/account/:id/live-data-file', async (req, res) => {
    try {
      const accountId = req.params.id;
      const account = await Accounts.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
  
      const { accountName, liveDataFile } = account;
      if (!accountName || !liveDataFile) {
        return res.status(400).json({ error: 'Invalid account data' });
      }
  
      const liveDataFilePath = path.join(__dirname, 'NewAccounts', liveDataFile);
      
  
      // Read Excel file and send the data
      readxlsxFile(liveDataFilePath).then((rows) => {
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
  });

  const sanitizePath = (filePath) => path.resolve(__dirname, 'NewAccounts', filePath);

// Endpoint to download file
app.get('/api/account/:accountId/download-file', async (req, res) => {
  const accountId = req.params.accountId;
  // Find account by ID
  const account = await Accounts.findById(accountId);
  const {liveDataFile}= account;
  if (!liveDataFile) {
    return res.status(400).json({ error: 'Invalid account data' });
  }

  if (account) {
    const filePath = path.join(__dirname, './NewAccounts', liveDataFile);
    if (fs.existsSync(filePath)) {
      res.download(filePath, err => {
        if (err) {
          console.error('Error downloading file:', err);
          console.log(account)

          res.status(500).send('Error downloading file');
          console.log(account)
        }
      });
    } else {
      res.status(404).send('File not found');
    }
  } else {
    res.status(404).send('Account not found');
  }
});



//Uploade File 

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

const upload = multer({ storage });

app.post('/api/account/:accountId/upload-file', upload.single('file'), async (req, res) => {
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

      // Delete the old liveDataFile if it exists
      const oldLiveDataFilePath = path.join(__dirname, 'NewAccounts', account.accountName, account.liveDataFile);
      if (fs.existsSync(oldLiveDataFilePath)) {
          fs.unlinkSync(oldLiveDataFilePath);
      }

      // Update the account with the new liveDataFile path
      account.liveDataFile = newFilePath;
      await account.save();

      res.json({ message: 'File uploaded, old file removed, and account updated successfully' });
  } catch (error) {
      console.error('Error uploading file and updating database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Other routes...


// Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).send('Internal Server Error');
// });



  // Update the Live Data File path
  app.put('/api/account/:accountId/update-row', async (req, res) => {
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
  
      const { liveDataFile } = account;
      const filePath = path.join(__dirname, 'NewAccounts', liveDataFile);
  
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
  });
  
  
  
  
  

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});