const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} = require('../utils/token');
const sendEmail = require('../utils/sendEmail');

// User Registration
exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  // Check if user already exists
  let userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Find the role
  let roleDoc = await Role.findOne({ name: role });
  if (!roleDoc) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Create the new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: roleDoc._id,
  });

  // Generate tokens
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  // Save refresh token in the database
  newUser.refreshToken = refreshToken;
  await newUser.save();

  // Set refresh token in cookies
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

  // Return success message along with tokens
  res.status(201).json({
    message: 'User registered successfully',
    accessToken, // Auto-login the user
  });
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
  res.json({ message: 'Login successful', accessToken });
});

// Password Reset Request
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token and hash it
  const { resetToken, hashedToken } = await generateResetToken();

  // Store hashed token and expiry in the database
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Reset link with frontend URL
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

  // Send Reset Email
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    template: 'forgot-password',
    data: { resetLink, name: user.firstName },
  });

  res.status(200).json({
    message: 'Password reset link sent. Check your inbox.',
    resetLink,
  });
});

// Reset Password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token and hash it
  const { resetToken, hashedToken } = await generateResetToken();

  // Store hashed token and expiry in the database
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Reset link with frontend URL
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

  // Send Reset Email
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    template: 'forgot-password',
    data: { resetLink, name: user.firstName },
  });

  res.status(200).json({
    message: 'Password reset link sent. Check your inbox.',
    resetLink,
  });
});

// Reset Password - Update New Password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, email, newPassword } = req.body;

  // Find user by email and ensure token is still valid
  const user = await User.findOne({
    email,
    resetPasswordExpire: { $gt: Date.now() }, // Token must still be valid
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  // Compare received token with stored hashed token
  const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid reset token' });
  }

  // Update password
  user.password = newPassword;

  // Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: 'No refresh token in request cookies' });
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
// Get Authenticated User Data
exports.getMe = asyncHandler(async (req, res) => {
  // Get user from request object (set by auth middleware)
  const user = await User.findById(req.user.userId)
    .populate({
      path: 'role',
      select: 'name permissions',
    })
    .populate({
      path: 'restaurantId',
      select: 'name address', // Customize fields as needed
    })
    .select('-password -refreshToken'); // Exclude sensitive fields

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Format response
  const userData = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    birthday: user.birthday,
    image: user.image,
    role: {
      name: user.role.name,
      permissions: user.role.permissions,
    },
    restaurant: user.restaurantId || null,
  };

  res.status(200).json(userData);
});
