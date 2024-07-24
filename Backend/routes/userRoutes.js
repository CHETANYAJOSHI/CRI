// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { createUser } = require('../controllers/userControllers');


// Middleware for file uploads


router.use(fileUpload());
router.post('/createaccount', createUser);

module.exports = router;
