const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

async function processExcel(excelFilePath, pdfFolderPath1, pdfFolderPath2, outputFilePath) {
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Assuming the column to check is the first column
    const headers = data[0];
    headers.push('PDF File Name');

    for (let i = 1; i < data.length; i++) {
        const employeeCode = data[i][0];
        let pdfFileName = findMatchingPdf(pdfFolderPath1, employeeCode);
        if (!pdfFileName) {
            pdfFileName = findMatchingPdf(pdfFolderPath2, employeeCode);
        }
        data[i].push(pdfFileName || 'No matching PDF');
    }

    const newWorksheet = XLSX.utils.aoa_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

    XLSX.writeFile(newWorkbook, outputFilePath);
}

function findMatchingPdf(pdfFolderPath, employeeCode) {
    const files = fs.readdirSync(pdfFolderPath);
    for (const file of files) {
        if (file.startsWith(employeeCode.toString())) {
            return file;
        }
    }
    return null;
}

module.exports = processExcel;
