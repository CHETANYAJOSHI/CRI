// backend/routes/userRoutes.js
const express = require('express');
const { createUser } = require('../controllers/userControllers');
const fileUpload = require('express-fileupload');

// Middleware for file uploads

const router = express.Router();
router.use(fileUpload());
router.post('/createaccount', createUser);

module.exports = router;
