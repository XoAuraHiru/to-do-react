const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { updateProfile, getUserActivity, changePassword } = require('../controllers/user.controller');
const { validateProfileUpdate, changePasswordValidation } = require('../middleware/validation.middleware');

// All routes require authentication
router.use(protect);

// Update profile
router.put('/profile', validateProfileUpdate, updateProfile);

// Get user activity
router.get('/activity', getUserActivity);

// Change password
router.post('/change-password', changePasswordValidation, changePassword);

module.exports = router;