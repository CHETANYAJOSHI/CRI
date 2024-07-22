// deletedFileHandler.js
const express = require('express');
const path = require('path');
const xlsx = require('xlsx');
const multer = require('multer');

const DELETED_FILE_PATH = path.join(__dirname, 'floateddeleted', 'floated.xlsx');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'floateddeleted/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
      cb(null, 'floated.xlsx'); // Always save as data.xlsx
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      file.mimetype !== 'application/vnd.ms-excel') {
      return cb(new Error('Only Excel files are allowed'), false);
  }
  cb(null, true);
};

const floaterupload = multer({ storage: storage, fileFilter:fileFilter});

const floaterUpload = (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).send('No file uploaded.');
      }

      // Process the uploaded file
      const fileInfo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
      };
      res.json({ message: 'File uploaded and replaced successfully', fileInfo });
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
  }
};

const floaterDownload = (req,res) => {
  const filePath = DELETED_FILE_PATH;
  res.download(filePath, 'deleted_data.xlsx', (err) => {
      if (err) {
          console.error('Error downloading file:', err);
          res.status(500).send('Error downloading file');
      }
  });
};



// Function to read Excel data from the first sheet
const readDeletedExcelData = () => {
  const workbook = xlsx.readFile(DELETED_FILE_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const xlData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });
  return xlData;
};

// Function to write Excel data to the file
const writeDeletedExcelData = (xlData) => {
  const newWorkbook = xlsx.utils.book_new();
  const newWorksheet = xlsx.utils.aoa_to_sheet(xlData);
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
  xlsx.writeFile(newWorkbook, DELETED_FILE_PATH);
};

// Handler to fetch data from Excel file
const getfloatDeletedDataHandler = (req, res) => {
  try {
    const xlData = readDeletedExcelData();
    const headers = xlData[0];
    const data = xlData.slice(1);
    res.json({ headers, data });
   
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Handler to update a specific row
const floatupdateRowHandler = (req, res) => {
  try {
    const { rowIndex } = req.params;
    const updatedData = req.body;

    let xlData = readDeletedExcelData();

    if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= xlData.length - 1) {
      return res.status(400).json({ error: 'Invalid row index' });
    }

    const headers = xlData[0];
    const updatedRow = headers.map((header, index) => updatedData[`column_${index}`] || '');
    xlData[parseInt(rowIndex) + 1] = updatedRow;

    writeDeletedExcelData(xlData);

    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
};

// Handler to delete a specific row
const floatdeleteRowHandler = (req, res) => {
  try {
    const { rowIndex } = req.params;

    let xlData = readDeletedExcelData();

    if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= xlData.length - 1) {
      return res.status(400).json({ error: 'Invalid row index' });
    }

    xlData = xlData.filter((_, index) => index !== parseInt(rowIndex) + 1);

    writeDeletedExcelData(xlData);

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Failed to delete data' });
  }
};

module.exports = {
    getfloatDeletedDataHandler,
    floatupdateRowHandler,
    floatdeleteRowHandler,
    floaterDownload,
    floaterUpload,
    floaterupload
};
