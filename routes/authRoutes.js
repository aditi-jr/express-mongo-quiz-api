const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Route for POST /api/auth/register
router.post('/register', register);

// Route for POST /api/auth/login
router.post('/login', login);

module.exports = router;