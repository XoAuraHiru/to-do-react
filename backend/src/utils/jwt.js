const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' } // 15minutes access token
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const generateTokens = async (user) => {
  // Generate access token
  const accessToken = generateAccessToken(user._id);

  // Generate refresh token
  const refreshToken = generateRefreshToken();
  
  // Calculate refresh token expiry (30 days)
  const refreshTokenExpiryDate = new Date();
  refreshTokenExpiryDate.setDate(refreshTokenExpiryDate.getDate() + 30);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  user.refreshTokenExpiryDate = refreshTokenExpiryDate;
  await user.save();

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiryDate
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  generateTokens
};