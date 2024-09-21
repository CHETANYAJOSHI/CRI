const express = require('express');
const cors = require('cors');
const path = require('path');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');

const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const accountRouters = require('./routes/accountRoutes');
const authRoutes = require('./routes/authRoutes');
const Accounts= require('./models/createaccount');
const Account=require('./routes/download');
const bulkRequest=require('./routes/bulkRequest');
const notification = require('./routes/notifications');
const employeeRequest = require('./routes/employeeRequests');
const multer = require('multer');
// const authenticateAdmin = require('./controllers/authController');

const readxlsxFile = require('read-excel-file/node');
// const fileUpload = require('express-fileupload');
const moment = require('moment');
const fs = require('fs');
const { embedPdfInExcel } = require('./processexcel');
const app = express();
const PORT = 5000;
const FILE_PATH = path.join(__dirname, 'uploads', 'data.xlsx');

//
// BulkRequest 

// const bulkRequest = require('./routes/bulkRequest');

//

const { getSelfParentDataFile, downloadSelfParentDataFile, uploadSelfParentDataFile, updateSelfParentDataRow, AddSelfParentUser,selfupload } = require('./deletedFileHandle');
const { getFloaterParentDataFile,   downloadFloaterParentDataFile,   uploadFloaterParentDataFile,   updateFloaterParentDataRow, AddFloaterParentUser,   floaterUpload } = require('./floaterDeleted');
const { getClaimsDataFile, downloadClaimsDataFile, uploadClaimsDataFile, updateClaimsDataRow,AddSelfClaim,getSpecificSelfClaimsData, claimupload } = require('./claimdump');
const { getrackRatesFile,downloadrackRatesFile,uploadrackRatesFile,rackRatesUpload}= require("./rackrates");
const { getFloaterLive, downloadFloaterLive, uploadFloaterLive, updateFloaterLive, AddFloaterLive , getInactiveFloaterLive , floaterUploadLive , countBenefStatus , getSpecificSelfFloaterFile} = require('./Livefloater');
const { getClaimsfloaterFile, downloadClaimsfloaterFile, uploadClaimsfloaterFile, updateClaimsfloaterRow, AddfloaterClaim,getSpecificClaimsData,claimFloaterupload } = require('./Floaterclaimdump')
const { getClaimSelfAnalysis, downloadClaimSelfAnalysis, uploadClaimSelfAnalysis , claimSelfAnalysisUpload } = require('./ClaimAnalysis')
const { getClaimFloaterAnalysis, downloadClaimFloaterAnalysis, uploadClaimFloaterAnalysis , claimFloaterAnalysisUpload } = require('./FloaterClaimAnalysis');
const { getAdditionDataFile, downloadAdditionDataFile, uploadAdditionDataFile, updateAdditionDataRow, AddSelfAddition,getNotifications,updateNotification , Additionupload } = require('./Addition');
const { getDeletionDataFile, downloadDeletionDataFile, uploadDeletionDataFile, updateDeletionDataRow, AddSelfDeletion , Deletionupload } = require('./Deletition');

const { getCDfile, downloadCDfile, uploadCDfile , CDfileUpload } = require('./CDStatement');
const { getSelfPolicyfile, downloadSelfPolicyfile, uploadSelfPolicy , SelfPolicyUpload } = require('./SelfPolicy');
const { getFloaterPolicyfile, downloadFloaterPolicyfile, uploadFloaterPolicy , FloaterPolicyUpload } = require('./FloaterPolicy');


const pdfRouter = require('./pdfHandler');

require('dotenv').config();

const connectDB = require('./config');
// const {BulkRequest} = require('./models/BulkRequest');

// app.use(fileUpload());

connectDB();
app.use(cors());

app.use(bodyParser.json());


app.use('/api/files' , Account)
app.use('/api' , accountRouters)
app.use('/api', userRoutes)

app.use('/api' , bulkRequest);
app.use('/api' , notification);
app.use('/api', employeeRequest);
// Otp Routes

app.use('/api/auth' , authRoutes);
// app.use('/api' , BulkRequest);


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
app.get('/api/account/:id/getSpecificSelfFloaterFile' , getSpecificSelfFloaterFile);
app.get('/api/account/:id/getInactiveData' , getInactiveFloaterLive);








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
app.get('/api/claims-Self-specific/:id', getSpecificSelfClaimsData);


//FloaterClaimDump


app.get('/api/account/:id/floaterclaims-data-file', getClaimsfloaterFile);

// Download claims data file
app.get('/api/account/:accountId/download-floaterclaim-file', downloadClaimsfloaterFile);

// Upload claims data file
app.post('/api/account/:accountId/upload-floaterclaim-file', claimFloaterupload.single('file'), uploadClaimsfloaterFile);

// Update a row in the claims data file
app.put('/api/account/:accountId/update-floaterclaim-row', updateClaimsfloaterRow);
app.post('/api/account/:accountId/add-claim-floater-row' , AddfloaterClaim);
app.get('/api/claims-floater-specific/:id', getSpecificClaimsData);




// app.get('/api/claimdumpexcel', claimdumpdatahandler);
// app.put('/api/claimdumpupdate/:rowIndex', updateclaimdump);
// // app.delete('/api/floatdelete-row/:rowIndex', floatdeleteRowHandler);
// app.get('/api/claimdumpdownload-file', claimdumpdownload);
// app.post('/api/claimdumpupload-file',claimdump.single('file'), claimdumpupload);


app.get('/api/account/:id/rackrates-file', getrackRatesFile);
app.get('/api/account/:accountId/download-rackrates-file', downloadrackRatesFile);
app.post('/api/account/:accountId/upload-rackratesfile', rackRatesUpload.single('file'), uploadrackRatesFile);
// app.put('/api/account/:accountId/update-rackrates-row', updaterackRatesFile);
// app.post('/api/account/:accountId/add-rackrates-row' , AddrackRatesFile);
// app.get('/api/pdf/countBenefStatus/:id' , countBenefStatus);



// try this

//Endorsement Addition Data

app.get('/api/account/:id/Addition', getAdditionDataFile);
app.get('/api/account/:accountId/download-Addition', downloadAdditionDataFile);
app.post('/api/account/:accountId/upload-Addition', Additionupload.single('file'), uploadAdditionDataFile);
app.put('/api/account/:accountId/update-Addition', updateAdditionDataRow);
app.post('/api/account/:accountId/add-Addition' , AddSelfAddition);
app.put('/api/notifications/mmarkAsRead/:id' ,updateNotification);
app.get('/api/fileNotification' , getNotifications);


//Endorsement Deletion Data

app.get('/api/account/:id/Deletion', getDeletionDataFile);
app.get('/api/account/:accountId/download-Deletion', downloadDeletionDataFile);
app.post('/api/account/:accountId/upload-Deletion', Deletionupload.single('file'), uploadDeletionDataFile);
app.put('/api/account/:accountId/update-Deletion', updateDeletionDataRow);
app.post('/api/account/:accountId/add-Deletion' , AddSelfDeletion);
// app.get('/api/delNotification' , getDelNotifications);



//

const formatExcelDate = (serialDate) => {
  const startDate = new Date(1899, 11, 30); // Excel's base date is December 30, 1899
  const days = Math.floor(serialDate);
  const date = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
  const year = date.getFullYear();

  // Return formatted date in dd-MM-YYYY
  return `${day}-${month}-${year}`;
};

//Send the intimation file to the email
app.post('/api/send-email', async (req, res) => {
  try {
    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(req.body);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Claim Data');

    // Generate a buffer for the Excel file
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set up the email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: 'chetanyajoshi9654@gmail.com',
        pass: 'uale nfrb oqjp joga', // Use environment variables for security
      },
    });

    // Prepare email options
    const mailOptions = {
      from: 'chetanyajoshi9654@gmail.com',
      to: 'anish@cri.co.in',
      subject: 'Claim Intimation Data',
      text: 'Please find the attached Excel file with the claim data.',
      attachments: [
        {
          filename: 'claim_data.xlsx',
          content: excelBuffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});


const searchFile = async (filePath, mobileNumber) => {
  try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      const headers = worksheet[0];
      const dataRows = worksheet.slice(1);

      let mobileIndex = headers.indexOf('Mobile No');
      if (mobileIndex === -1) {
          mobileIndex = headers.indexOf('benef_mobile no');
          if (mobileIndex === -1) {
              return { error: '"Mobile No" or "benef_mobile no" column not found' };
          }
      }

      const matchedRows = dataRows.filter(row => row[mobileIndex] == mobileNumber);
      if (matchedRows.length === 0) {
          return null;
      }

      return {
          filename: path.basename(filePath),
          data: matchedRows.map(row => {
              const rowData = {};
              headers.forEach((header, index) => {
                  let value = row[index];

                  if (header.toLowerCase().includes('dob') || 
                      header.toLowerCase().includes('polstartdate') || 
                      header.toLowerCase().includes('polenddate')) {
                      if (typeof value === 'number') {
                          value = formatExcelDate(value);
                      }
                  }

                  rowData[header] = value;
              });
              return rowData;
          })
      };
  } catch (error) {
      console.error('Error reading file:', error);
      return { error: 'Failed to read the Excel file' };
  }
};

app.post('/api/employee/login', async (req, res) => {
  try {
      const { mobileNumber } = req.body;
      if (!mobileNumber) {
          return res.status(400).json({ error: 'Mobile number is required' });
      }

      // Fetch all accounts
      const accounts = await Accounts.find();

      for (const account of accounts) {
          const { _id,  liveDataSelfFile ,liveDataFloaterFile} = account;

          // Search the liveDataFloaterFile if available
          if (liveDataFloaterFile) {
              const liveDataFloaterFilePath = path.join(__dirname, 'NewAccounts', liveDataFloaterFile);
              let result = await searchFile(liveDataFloaterFilePath, mobileNumber);

              if (result) {
                  return res.json({
                      message: 'Employee data found',
                      accountId: _id,
                      // filename: result.filename,
                      // data: result.data
                  });
              }
          }

          // Search the liveDataSelfFile if available
          if (liveDataSelfFile) {
              const liveDataSelfFilePath = path.join(__dirname, 'NewAccounts', liveDataSelfFile);
              let result = await searchFile(liveDataSelfFilePath, mobileNumber);

              if (result) {
                  return res.json({
                      message: 'Employee data found',
                      accountId: _id,
                      // filename: result.filename,
                      // data: result.data
                  });
              }
          }
      }

      res.status(404).json({ error: 'No data found for the given mobile number' });
  } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//



app.get('/api/check-null-fields/:accountId', async (req, res) => {
  const { accountId } = req.params;

  try {
    // Find the account by ID
    const account = await Accounts.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Fields to check for null values
    const fieldsToCheck = [
      'cdStatementFile',
      'claimSelfAnalysisFile',
      'claimFloaterAnalysisFile',
      'claimDumpSelfFile',
      'claimDumpFloaterFile',
      'liveDataSelfFile',
      'liveDataFloaterFile',
      'claimABFile',
      'rackRatesFile',
      'checkListFile',
      'exclusionListFile',
      'additionDataFile',
      'deletionDataFile',
      'policyCoverageSelfFile',
      'policyCoverageFloaterFile',
    ];

    // Find null fields
    const nullFields = fieldsToCheck.filter(field => account[field] === null);

    if (nullFields.length > 0) {
      console.log('Null fields:', nullFields);
    } else {
      console.log('No null fields found.');
    }

    // Send the null fields in the response
    res.status(200).json({ nullFields });
  } catch (error) {
    console.error('Error checking null fields:', error);
    res.status(500).json({ error: 'Error checking null fields' });
  }
});



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

  app.get('/api/account/:id/live-data-specificedata', async (req, res) => {
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
  });


  app.get('/api/account/:id/pribenef-data-file', async (req, res) => {
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
  
      // Read Excel file and send the data
      readxlsxFile(liveDataFilePath).then((rows) => {
        const headers = rows[0];
        const pribenefIndex = headers.indexOf('pribenef_name');
  
        if (pribenefIndex === -1) {
          return res.status(400).json({ error: 'Column "pribenef_name" not found in the Excel file' });
        }
  
        const pribenefData = rows.slice(1).map(row => row[pribenefIndex]);
  
        res.json({ pribenef_name: pribenefData });
      }).catch(error => {
        console.error('Error reading Excel file:', error);
        res.status(500).json({ error: 'Failed to read Excel file' });
      });
    } catch (error) {
      console.error('Error fetching account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // Find the E-card from the folder
  app.get('/api/download-e-card/:employeeId', (req, res) => {
    const { employeeId } = req.params;
  
    // Paths to the two folders
    const folderPaths = [
      path.join(__dirname, 'Employee and Parents'),
      path.join(__dirname, 'Employee, Family & Parents'),
    ];
  
    let pdfFile = null;
  
    // Function to search for the PDF file in the given folders
    const searchForPdf = (folders, index = 0) => {
      if (index >= folders.length) {
        // If no PDF found in any folder, return 404
        return res.status(404).json({ error: 'PDF not found for the given employee.' });
      }
  
      const folderPath = folders[index];
      
      // Read the files in the current folder
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          return res.status(500).json({ error: `Error reading folder: ${folderPath}` });
        }
  
        // Find the PDF that starts with the employeeId
        pdfFile = files.find(file => file.startsWith(employeeId) && file.endsWith('.pdf'));
  
        if (pdfFile) {
          // If PDF is found, send the file for download
          const filePath = path.join(folderPath, pdfFile);
          res.download(filePath, (err) => {
            if (err) {
              console.error('Error sending the PDF:', err);
              return res.status(500).json({ error: 'Error downloading the PDF.' });
            }
          });
        } else {
          // If PDF is not found in this folder, check the next one
          searchForPdf(folders, index + 1);
        }
      });
    };
  
    // Start searching for the PDF in both folders
    searchForPdf(folderPaths);
  });


  
  
  app.get('/api/account/:id/live-data-by-mobile/:mobile', async (req, res) => {
    try {
      const accountId = req.params.id;
      const mobileNumber = req.params.mobile;
  
      // Find the account by ID
      const account = await Accounts.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
  
      const { accountName, liveDataFloaterFile, liveDataSelfFile } = account;
      if (!accountName || (!liveDataFloaterFile && !liveDataSelfFile)) {
        return res.status(400).json({ error: 'Invalid account data' });
      }
  
      // Helper function to read and search a file
      const searchFile = async (filePath) => {
        try {
          // Read the Excel file
          const workbook = xlsx.readFile(filePath);
          const sheetName = workbook.SheetNames[0];
          const worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  
          // Extract headers and data rows
          const headers = worksheet[0];
          const dataRows = worksheet.slice(1);
  
          // Try to find the index of "Mobile No" column
          let mobileIndex = headers.indexOf('Mobile No');
  
          // If "Mobile No" column not found, check for alternative column names
          if (mobileIndex === -1) {
            mobileIndex = headers.indexOf('benef_mobile no');
            if (mobileIndex === -1) {
              return { error: '"Mobile No" or "benef_mobile" column not found' };
            }
          }
  
          // Filter rows that match the specific mobile number
          const matchedRows = dataRows.filter(row => row[mobileIndex] == mobileNumber);
          if (matchedRows.length === 0) {
            return null;
          }
  
          // Format rows for response
          const formattedRows = matchedRows.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
              let value = row[index];
  
              // Convert date values if necessary
              if (header.toLowerCase().includes('dob') && typeof value === 'number') {
                value = formatExcelDate(value);
              } else if (header.toLowerCase() === 'polstartdate' && typeof value === 'number') {
                value = formatExcelDate(value);
              } else if (header.toLowerCase() === 'polenddate' && typeof value === 'number') {
                value = formatExcelDate(value);
              }
  
              rowData[header] = value;
            });
            return rowData;
          });
  
          return formattedRows;
        } catch (error) {
          console.error('Error reading file:', error);
          return { error: 'Error reading file' };
        }
      };
  
      // Check the liveDataFloaterFile first
      if (liveDataFloaterFile) {
        const liveDataFloaterFilePath = path.join(__dirname, 'NewAccounts', liveDataFloaterFile);
        let result = await searchFile(liveDataFloaterFilePath);
  
        // If no data found in liveDataFloaterFile, check liveDataSelfFile
        if (!result) {
          if (liveDataSelfFile) {
            const liveDataSelfFilePath = path.join(__dirname, 'NewAccounts', liveDataSelfFile);
            result = await searchFile(liveDataSelfFilePath);
          }
        }
  
        // Return the result if found
        if (result && result.error) {
          return res.status(400).json({ error: result.error });
        } else if (result && result.length === 0) {
          return res.status(404).json({ error: 'No data found for the given mobile number' });
        }
  
        return res.json(result);
      } else if (liveDataSelfFile) {
        // If liveDataFloaterFile is null, directly check liveDataSelfFile
        const liveDataSelfFilePath = path.join(__dirname, 'NewAccounts', liveDataSelfFile);
        const result = await searchFile(liveDataSelfFilePath);
  
        // Return the result if found
        if (result && result.error) {
          return res.status(400).json({ error: result.error });
        } else if (result && result.length === 0) {
          return res.status(404).json({ error: 'No data found for the given mobile number' });
        }
  
        return res.json(result);
      } else {
        return res.status(400).json({ error: 'No valid data file available' });
      }
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