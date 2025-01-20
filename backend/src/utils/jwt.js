import { sign, verify } from 'jsonwebtoken';
import logger from '../config/logger';

const generateToken = (userId) => {
  return sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('Token verification failed', {
      error: error.message
    });
    throw new Error('Invalid token');
  }
};

export default {
  generateToken,
  verifyToken
};