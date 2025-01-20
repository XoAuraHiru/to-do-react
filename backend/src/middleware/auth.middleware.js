const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../config/logger');

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      logger.warn('Authorization token missing or invalid format');
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    // Get token from Bearer token
    const token = authorization.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.debug('Token verified successfully', { userId: decoded.id });

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        logger.warn('User not found for valid token', { userId: decoded.id });
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed', {
        error: error.message
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error', { 
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { protect };