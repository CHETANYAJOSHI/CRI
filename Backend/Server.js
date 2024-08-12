const express = require('express');
const cors = require('cors');
const path = require('path');
const xlsx = require('xlsx');

const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
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
const { getSelfParentDataFile, downloadSelfParentDataFile, uploadSelfParentDataFile, updateSelfParentDataRow, AddSelfParentUser,selfupload } = require('./deletedFileHandle');
const {   getFloaterParentDataFile,   downloadFloaterParentDataFile,   uploadFloaterParentDataFile,   updateFloaterParentDataRow, AddFloaterParentUser,   floaterUpload } = require('./floaterDeleted');
const { getClaimsDataFile, downloadClaimsDataFile, uploadClaimsDataFile, updateClaimsDataRow,AddSelfClaim, claimupload } = require('./claimdump')
const {rackdatahandler,updaterack,rackdownload,rackupload,rack}= require("./rackrates");
const { getFloaterLive, downloadFloaterLive, uploadFloaterLive, updateFloaterLive, AddFloaterLive , floaterUploadLive , countBenefStatus} = require('./Livefloater');
const { getClaimsfloaterFile, downloadClaimsfloaterFile, uploadClaimsfloaterFile, updateClaimsfloaterRow, AddfloaterClaim,claimFloaterupload } = require('./Floaterclaimdump')
const { getClaimSelfAnalysis, downloadClaimSelfAnalysis, uploadClaimSelfAnalysis , claimSelfAnalysisUpload } = require('./ClaimAnalysis')
const { getClaimFloaterAnalysis, downloadClaimFloaterAnalysis, uploadClaimFloaterAnalysis , claimFloaterAnalysisUpload } = require('./FloaterClaimAnalysis');
const { getAdditionDataFile, downloadAdditionDataFile, uploadAdditionDataFile, updateAdditionDataRow, AddSelfAddition , Additionupload } = require('./Addition');
const { getDeletionDataFile, downloadDeletionDataFile, uploadDeletionDataFile, updateDeletionDataRow, AddSelfDeletion , Deletionupload } = require('./Deletition');

const { getCDfile, downloadCDfile, uploadCDfile , CDfileUpload } = require('./CDStatement');
const { getSelfPolicyfile, downloadSelfPolicyfile, uploadSelfPolicy , SelfPolicyUpload } = require('./SelfPolicy');
const { getFloaterPolicyfile, downloadFloaterPolicyfile, uploadFloaterPolicy , FloaterPolicyUpload } = require('./FloaterPolicy');


const pdfRouter = require('./pdfHandler');

require('dotenv').config();

const connectDB = require('./config');

// app.use(fileUpload());

connectDB();
app.use(cors());

app.use(bodyParser.json());


app.use('/api/files' , Account)
app.use('/api' , accountRouters)
app.use('/api', userRoutes)




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

//ClaimAnalysis Self

app.get('/api/claim-self-analysis/:id', getClaimSelfAnalysis);
app.get('/api/claim-self-analysis/download/:accountId', downloadClaimSelfAnalysis);
app.post('/api/claim-self-analysis/upload/:accountId', claimSelfAnalysisUpload.single('file'), uploadClaimSelfAnalysis);



//FloaterClaimAnalysis Self

app.get('/api/claim-floater-analysis/:id', getClaimFloaterAnalysis);
app.get('/api/claim-floater-analysis/download/:accountId', downloadClaimFloaterAnalysis);
app.post('/api/claim-floater-analysis/upload/:accountId', claimFloaterAnalysisUpload.single('file'), uploadClaimFloaterAnalysis);


// Self Policy Coverage

app.get('/api/SelfPolicyCoverage/:id', getSelfPolicyfile);
app.get('/api/SelfPolicyCoverage/download/:accountId', downloadSelfPolicyfile);
app.post('/api/SelfPolicyCoverage/upload/:accountId', SelfPolicyUpload.single('file'), uploadSelfPolicy);



// Floater Policy Coverage

app.get('/api/FloaterPolicyCoverage/:id', getFloaterPolicyfile);
app.get('/api/FloaterPolicyCoverage/download/:accountId', downloadFloaterPolicyfile);
app.post('/api/FloaterPolicyCoverage/upload/:accountId', FloaterPolicyUpload.single('file'), uploadFloaterPolicy);




// CDstatement
app.get('/api/CDStatement/:id', getCDfile);
app.get('/api/CDStatement/download/:accountId', downloadCDfile);
app.post('/api/CDStatement/upload/:accountId', CDfileUpload.single('file'), uploadCDfile);






//Floater Live Data



app.get('/api/account/:id/livefloater-parent-data-file', getFloaterLive);
app.get('/api/account/:accountId/download-livefloater-parent-file', downloadFloaterLive);
app.post('/api/account/:accountId/upload-livefloater-parent-file', floaterUploadLive.single('file'), uploadFloaterLive);
app.put('/api/account/:accountId/update-livefloater-parent-row', updateFloaterLive);
app.post('/api/account/:accountId/add-livefloater-parent-row' , AddFloaterLive);
app.get('/api/pdf/countBenefStatus/:id' , countBenefStatus);








app.use('/pdf', pdfRouter);
app.get('/api/account/:id/self-parent-data-file', getSelfParentDataFile);
app.get('/api/account/:accountId/download-self-parent-file', downloadSelfParentDataFile);
app.post('/api/account/:accountId/upload-self-parent-file', selfupload.single('file'), uploadSelfParentDataFile);
app.put('/api/account/:accountId/update-self-parent-row', updateSelfParentDataRow);
app.post('/api/account/:accountId/add-self-parent-row' , AddSelfParentUser);



// floated deleted
app.get('/api/account/:id/floater-parent-file', getFloaterParentDataFile);
app.get('/api/account/:accountId/download-floater-parent-file', downloadFloaterParentDataFile);
app.post('/api/account/:accountId/upload-floater-parent-file', floaterUpload.single('file'), uploadFloaterParentDataFile);
app.put('/api/account/:accountId/update-floater-parent-row', updateFloaterParentDataRow);
app.post('/api/account/:accountId/add-floater-parent-row' , AddFloaterParentUser);


//Selfclaimdump

// Fetch and read claims data file
app.get('/api/account/:id/claims-data-file', getClaimsDataFile);

// Download claims data file
app.get('/api/account/:accountId/download-claim-file', downloadClaimsDataFile);

// Upload claims data file
app.post('/api/account/:accountId/upload-claim-file', claimupload.single('file'), uploadClaimsDataFile);

// Update a row in the claims data file
app.put('/api/account/:accountId/update-claim-row', updateClaimsDataRow);
app.post('/api/account/:accountId/add-claim-self-row' , AddSelfClaim);


//FloaterClaimDump


app.get('/api/account/:id/floaterclaims-data-file', getClaimsfloaterFile);

// Download claims data file
app.get('/api/account/:accountId/download-floaterclaim-file', downloadClaimsfloaterFile);

// Upload claims data file
app.post('/api/account/:accountId/upload-floaterclaim-file', claimFloaterupload.single('file'), uploadClaimsfloaterFile);

// Update a row in the claims data file
app.put('/api/account/:accountId/update-floaterclaim-row', updateClaimsfloaterRow);
app.post('/api/account/:accountId/add-claim-floater-row' , AddfloaterClaim);




// app.get('/api/claimdumpexcel', claimdumpdatahandler);
// app.put('/api/claimdumpupdate/:rowIndex', updateclaimdump);
// // app.delete('/api/floatdelete-row/:rowIndex', floatdeleteRowHandler);
// app.get('/api/claimdumpdownload-file', claimdumpdownload);
// app.post('/api/claimdumpupload-file',claimdump.single('file'), claimdumpupload);


app.get('/api/rackexcel', rackdatahandler);
app.put('/api/rackupdate/:rowIndex', updaterack);
// app.delete('/api/floatdelete-row/:rowIndex', floatdeleteRowHandler);
app.get('/api/rackdownload-file', rackdownload);
app.post('/api/rackupload-file',rack.single('file'), rackupload);


// try this

//Endorsement Addition Data

app.get('/api/account/:id/Addition', getAdditionDataFile);
app.get('/api/account/:accountId/download-Addition', downloadAdditionDataFile);
app.post('/api/account/:accountId/upload-Addition', Additionupload.single('file'), uploadAdditionDataFile);
app.put('/api/account/:accountId/update-Addition', updateAdditionDataRow);
app.post('/api/account/:accountId/add-Addition' , AddSelfAddition);


//Endorsement Deletion Data

app.get('/api/account/:id/Deletion', getDeletionDataFile);
app.get('/api/account/:accountId/download-Deletion', downloadDeletionDataFile);
app.post('/api/account/:accountId/upload-Deletion', Deletionupload.single('file'), uploadDeletionDataFile);
app.put('/api/account/:accountId/update-Deletion', updateDeletionDataRow);
app.post('/api/account/:accountId/add-Deletion' , AddSelfDeletion);



app.get('/api/account/:id/live-data-file', async (req, res) => {
    try {
      const accountId = req.params.id;
      const account = await Accounts.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
  
      const { accountName, liveDataSelfFile } = account;
      if (!accountName || !liveDataSelfFile) {
        return res.status(400).json({ error: 'Invalid account data' });
      }
  
      const liveDataFilePath = path.join(__dirname, 'NewAccounts', liveDataSelfFile);
      
  
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
  const {liveDataSelfFile}= account;
  if (!liveDataSelfFile) {
    return res.status(400).json({ error: 'Invalid account data' });
  }

  if (account) {
    const filePath = path.join(__dirname, './NewAccounts', liveDataSelfFile);
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
      const oldLiveDataFilePath = path.join(__dirname, 'NewAccounts', account.accountName, account.liveDataSelfFile);
      if (fs.existsSync(oldLiveDataFilePath)) {
          fs.unlinkSync(oldLiveDataFilePath);
      }

      // Update the account with the new liveDataFile path
      account.liveDataSelfFile = newFilePath;
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
  
      const { liveDataSelfFile } = account;
      const filePath = path.join(__dirname, 'NewAccounts', liveDataSelfFile);
  
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


  app.post('/api/account/:accountId/add-live-data-row', async (req, res) => {
    const { accountId } = req.params;
  const { newRowData } = req.body;

  try {
    const account = await Accounts.findById(accountId);
    const { liveDataSelfFile } = account;
    const filePath = path.join(__dirname, 'NewAccounts', liveDataSelfFile);

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
  });
  
  
  
  
  

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});