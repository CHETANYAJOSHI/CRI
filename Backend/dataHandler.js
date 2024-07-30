const path = require('path');
const xlsx = require('xlsx');
const moment = require('moment');
const Account = require('./models/createaccount'); // Adjust the path based on your project structure

const getLiveDataFileById = async (id) => {
    try {
        const account = await Account.findById(id);
        return account ? account.liveDataFile : null;
    } catch (error) {
        console.error('Error fetching live data file:', error);
        return null;
    }
};

const readExcelData = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const xlData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const filteredData = xlData.filter(row => row.some(cell => !!cell));
    const headers = filteredData[0];

    const excludeFields = ['ro_code', 'do_code', 'bo_code', 'pribenef_employee_code', 'benef_sum_insured', 'benef_domi_limit', 'pribenef_floater_sum', 'benef_age'];

    const cleanedData = filteredData.slice(1).map(row => {
        let rowData = {};
        headers.forEach((header, index) => {
            const cellValue = row[index];
            if (cellValue !== undefined && cellValue !== null) {
                if (excludeFields.includes(header)) {
                    rowData[header] = cellValue.toString().trim();
                } else {
                    if (/^\d{2}-\d{2}-\d{4}$/.test(cellValue)) {
                        const formattedDate = moment(cellValue, 'MM-DD-YYYY').format('YYYY-MM-DD');
                        rowData[header] = formattedDate;
                    } else if (typeof cellValue === 'number' && cellValue >= 1 && cellValue <= 2958465) {
                        rowData[header] = moment(new Date((cellValue - 25569) * 86400 * 1000)).format('YYYY-MM-DD');
                    } else {
                        rowData[header] = cellValue.toString().trim();
                    }
                }
            } else {
                rowData[header] = '';
            }
        });
        return rowData;
    });

    return { headers, cleanedData };
};

const getExcelDataById = async (id) => {
    const liveDataFile = await getLiveDataFileById(id);
    if (!liveDataFile) {
        throw new Error('Live data file not found');
    }
    const filePath = path.join(__dirname, '../NewAccounts', id, liveDataFile);
    return readExcelData(filePath);
};

module.exports = { getExcelDataById, getLiveDataFileById };
