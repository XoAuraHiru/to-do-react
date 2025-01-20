const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const crypto = require('crypto');
const logger = require('../config/logger');

// Register user method {POST /api/auth/register}
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    logger.info('Registering user', { email });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn('Registration failed - Email already exists', { email });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      verificationToken
    });

    logger.info('User registered successfully', { email });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error('Registration error', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info('User login', { email });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Login failed - User not found', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Login failed - Invalid password', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      logger.warn('Login failed - Email not verified', { email });
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      logger.warn('Invalid verification token', { token });
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    logger.info('Email verified successfully', { email: user.email });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Email verification error', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    logger.info('Forgot password request', { email });

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('User not found', { email });
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    logger.error('Forgot password error', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      logger.warn('Invalid or expired reset token', { token });
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('Password reset successful', { email: user.email });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    logger.error('Password reset error', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify token
const verifyToken = async (req, res) => {
  try {
    const user = req.user;
    logger.info('Token verified', { email: user.email });
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error('Token verification error', { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying token'
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyToken
};