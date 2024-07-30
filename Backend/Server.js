const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const accountRouters = require('./routes/accountRoutes');
const Accounts= require('./models/createaccount');
const Account=require('./routes/download');
const xlsx = require('xlsx');
const path = require('path');
const readxlsxFile = require('read-excel-file/node');
// const fileUpload = require('express-fileupload');
const moment = require('moment');
const fs = require('fs');
const multer = require('multer');
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

app.use('/api', userRoutes);



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
app.get('/api/download-file/:accountId', async (req, res) => {
    const { accountId } = req.params;
      
    try {
        // Fetch the file record from the database
        const fileDoc = await File.findById(accountId); // Adjust as needed
        if (!fileDoc) {
            return res.status(404).json({ error: 'File record not found' });
        }

        const filePath = fileDoc.liveDataFile; // Use liveDataFile to construct path

        // Construct the full path and sanitize it
        const sanitizedFilePath = sanitizePath(filePath);

        fs.stat(sanitizedFilePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Set appropriate headers and send the file
            res.download(sanitizedFilePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).json({ error: 'Error sending file' });
                }
            });
        });
    } catch (error) {
        console.error('Error fetching file path:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


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
  
  
  
  
  
// Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Destination folder for uploaded files
//     },
//     filename: function (req, file, cb) {
//         cb(null, 'data.xlsx'); // Always save as data.xlsx
//     }
// });


// const fileFilter = (req, file, cb) => {
//     if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
//         file.mimetype !== 'application/vnd.ms-excel') {
//         return cb(new Error('Only Excel files are allowed'), false);
//     }
//     cb(null, true);
// };

// const upload = multer({ storage: storage , fileFilter:fileFilter });

// // Endpoint to download the Excel file
// app.get('/download-file', (req, res) => {
//     const filePath = FILE_PATH;
//     res.download(filePath, 'data.xlsx', (err) => {
//         if (err) {
//             console.error('Error downloading file:', err);
//             res.status(500).send('Error downloading file');
//         }
//     });
// });

// // Endpoint to upload a new Excel file and replace existing file
// app.post('/upload-file', upload.single('file'), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         // Process the uploaded file
//         const fileInfo = {
//             filename: req.file.filename,
//             originalName: req.file.originalname,
//             size: req.file.size
//         };
//         res.json({ message: 'File uploaded and replaced successfully', fileInfo });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).send('Error uploading file');
//     }
// });


// // Function to read Excel data and convert dates
// const readExcelData = () => {
//     const workbook = xlsx.readFile(FILE_PATH);
//     const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
//     const worksheet = workbook.Sheets[sheetName];

//     // Convert worksheet to JSON
//     const xlData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//     // Filter out empty rows and normalize data
//     const filteredData = xlData.filter(row => row.some(cell => !!cell)); // Remove rows with all empty cells

//     // Identify headers from the first row
//     const headers = filteredData[0];

//     // List of fields to exclude from date conversion
//     const excludeFields = ['ro_code', 'do_code', 'bo_code', 'pribenef_employee_code', 'benef_sum_insured', 'benef_domi_limit', 'pribenef_floater_sum', 'benef_age'];

//     // Convert each row into an object, converting date strings to actual dates where applicable
//     const cleanedData = filteredData.slice(1).map(row => {
//         let rowData = {};
//         headers.forEach((header, index) => {
//             const cellValue = row[index];
//             if (cellValue !== undefined && cellValue !== null) {
//                 // Check if the header is in the excludeFields list
//                 if (excludeFields.includes(header)) {
//                     rowData[header] = cellValue.toString().trim(); // Keep as string and trim whitespace
//                 } else {
//                     // Check if the cell value matches date format MM-DD-YYYY
//                     if (/^\d{2}-\d{2}-\d{4}$/.test(cellValue)) {
//                         const formattedDate = moment(cellValue, 'MM-DD-YYYY').format('YYYY-MM-DD'); // Convert to desired date format
//                         rowData[header] = formattedDate;
//                     } else if (typeof cellValue === 'number' && cellValue >= 1 && cellValue <= 2958465) { // Handle Excel date serial numbers realistically
//                         rowData[header] = moment(new Date((cellValue - 25569) * 86400 * 1000)).format('YYYY-MM-DD');
//                     } else {
//                         rowData[header] = cellValue.toString().trim(); // Convert to string and trim whitespace for non-date fields
//                     }
//                 }
//             } else {
//                 rowData[header] = ''; // Set empty cells to empty string
//             }
//         });
//         return rowData;
//     });

//     return { headers, cleanedData };
// };

// // Endpoint to fetch paginated data
// app.get('/data', (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const perPage = 20;
//         const { headers, cleanedData } = readExcelData();

//         // Calculate pagination
//         const startIndex = (page - 1) * perPage;
//         const endIndex = startIndex + perPage;
//         const paginatedData = cleanedData.slice(startIndex, endIndex);

//         const totalPages = Math.ceil(cleanedData.length / perPage);

//         res.json({
//             data: paginatedData,
//             currentPage: page,
//             totalPages: totalPages,
//             headers: headers
//         });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Failed to fetch data' });
//     }
// });






// // Endpoint to update a specific row
// app.put('/data/:rowIndex', (req, res) => {
//     try {
//         const { rowIndex } = req.params;
//         const updatedData = req.body;

//         const workbook = xlsx.readFile(FILE_PATH);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         let xlData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//         // Ensure rowIndex is valid
//         if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= xlData.length) {
//             return res.status(400).json({ error: 'Invalid row index' });
//         }

//         // Update the specific row in xlData
//         const headers = xlData[0];
//         const updatedRow = headers.map(header => updatedData[header] || ''); // Ensure all headers are present
//         xlData[parseInt(rowIndex) + 1] = updatedRow; // Adjust for 1-based index

//         // Convert xlData back to xlsx format and save to file
//         const newWorkbook = xlsx.utils.book_new();
//         const newWorksheet = xlsx.utils.aoa_to_sheet(xlData);
//         xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
//         xlsx.writeFile(newWorkbook, FILE_PATH);

//         res.json({ message: 'Data updated successfully' });
//     } catch (error) {
//         console.error('Error updating data:', error);
//         res.status(500).json({ error: 'Failed to update data' });
//     }
// });

// // Endpoint to delete specific rows
// app.delete('/data', (req, res) => {
//     try {
//         const { ids } = req.body;

//         const workbook = xlsx.readFile(FILE_PATH);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         let xlData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//         // Validate the ids
//         if (!Array.isArray(ids) || ids.some(id => isNaN(id) || id < 0 || id >= xlData.length - 1)) {
//             return res.status(400).json({ error: 'Invalid row indices' });
//         }

//         // Remove the specified rows from xlData
//         xlData = xlData.filter((_, index) => !ids.includes(index - 1)); // Adjust for 1-based index

//         // Convert xlData back to xlsx format and save to file
//         const newWorkbook = xlsx.utils.book_new();
//         const newWorksheet = xlsx.utils.aoa_to_sheet(xlData);
//         xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
//         xlsx.writeFile(newWorkbook, FILE_PATH);

//         res.json({ message: 'Data deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting data:', error);
//         res.status(500).json({ error: 'Failed to delete data' });
//     }
// });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});