const express = require('express');
const router = express.Router();
const { getAllAccounts, getAccountData, updateAccount,claimdumpdatahandler } = require('../controllers/accountController');
// const fileUpload = require('express-fileupload');

// Middleware for file uploads
// router.use(fileUpload());

// Routes
router.get('/data/:accountId', claimdumpdatahandler);
router.get('/accounts', getAllAccounts);
router.get('/accounts/:id', getAccountData);
router.post('/accounts/:id', updateAccount);

module.exports = router;
