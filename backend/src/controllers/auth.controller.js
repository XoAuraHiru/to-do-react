const User = require('../models/user.model');
const { generateTokens, generateAccessToken } = require('../utils/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const crypto = require('crypto');
const logger = require('../config/logger');

// Register user method 
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

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

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate JWT
    const token = generateTokens(user._id);

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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    // Generate new tokens
    const tokens = await generateTokens(user);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      domain: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'localhost',
      path: '/'
    });

    res.json({
      accessToken: tokens.accessToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Find user with matching refresh token that hasn't expired
    const user = await User.findOne({
      refreshToken,
      refreshTokenExpiryDate: { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const tokens = await generateTokens(user);

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      accessToken: tokens.accessToken
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (refreshToken) {
      // Find user and remove refresh token
      await User.findOneAndUpdate(
        { refreshToken },
        { 
          $unset: { 
            refreshToken: 1,
            refreshTokenExpiryDate: 1
          }
        }
      );
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
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
  verifyToken,
  refreshToken,
  logout
};