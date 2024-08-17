// In utils/jwt.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'asdfasf@34'; // Replace with your actual secret key

const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
