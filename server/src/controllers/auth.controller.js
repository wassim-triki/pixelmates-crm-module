const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const Role = require('../models/Role');

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};
// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );
};

// User Registration
exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  let userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  let roleDoc = await Role.findOne({ name: role });
  if (!roleDoc) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const userData = {
    firstName,
    lastName,
    email,
    password,
    phone,
    role: roleDoc._id, // Store role reference
  };
  const newUser = await User.create(userData);

  res
    .status(201)
    .json({ message: 'User registered successfully', user: newUser });
});

// User Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('role');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.json({ accessToken });
});

// Password Reset Request
exports.requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_RESET_PASSWORD_SECRET,
    { expiresIn: '1h' }
  );
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  res.status(200).json({ message: 'Password reset link generated', resetLink });
});

// Reset Password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);

  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ message: 'No refresh token' });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token expired' });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});
