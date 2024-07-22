const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

// Directory and file path for the PDF
const pdfDirectory = path.join(__dirname, 'claimAnalysis');
const pdfFilePath = path.join(pdfDirectory, 'claimAnalysis.pdf');

// Ensure the directory exists
if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory);
}

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pdfDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, 'claimAnalysis.pdf');
    }
});

// File filter configuration for multer
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Endpoint to upload/replace PDF file
router.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

// Endpoint to serve PDF file
router.get('/file', (req, res) => {
    if (fs.existsSync(pdfFilePath)) {
        res.sendFile(pdfFilePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Endpoint to download PDF file
router.get('/download', (req, res) => {
    if (fs.existsSync(pdfFilePath)) {
        res.download(pdfFilePath);
    } else {
        res.status(404).send('File not found');
    }
});

module.exports = router;
