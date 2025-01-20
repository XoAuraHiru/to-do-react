const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('Token verification failed', {
      error: error.message
    });
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};