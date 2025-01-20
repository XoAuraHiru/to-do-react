
const express = require('express');
const router = express.Router();
const { 
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyToken
} = require('../controllers/auth.controller');

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation
} = require('../middleware/validation.middleware');

const { protect } = require('../middleware/auth.middleware');

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

//verify token
router.get('/verify-token', protect, verifyToken);

module.exports = router;