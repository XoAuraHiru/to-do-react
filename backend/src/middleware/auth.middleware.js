const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authorization = req.headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
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

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = { protect };