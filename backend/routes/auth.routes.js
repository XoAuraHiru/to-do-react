
const express = require('express');
const router = express.Router();
const { 
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Email verification
router.get('/verify-email/:token', verifyEmail);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);

module.exports = router;