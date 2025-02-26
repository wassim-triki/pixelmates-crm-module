const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const randomBytes = promisify(require('crypto').randomBytes);
const bcrypt = require('bcryptjs');
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );
};

async function generateResetToken() {
  const resetToken = (await randomBytes(32)).toString('hex');
  const hashedToken = await bcrypt.hash(resetToken, 10);

  return { resetToken, hashedToken };
}

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  generateResetToken,
};
