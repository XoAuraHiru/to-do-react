// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { 
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation
} = require('../middleware/validation.middleware');

// Register rout
router.post('/register', registerValidation, register);

// Login route
router.post('/login', loginValidation, login);

// Email verification
router.get('/verify-email/:token', verifyEmailValidation, verifyEmail);

// Forgot password
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

module.exports = router;