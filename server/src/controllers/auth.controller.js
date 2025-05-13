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
const { ROLES } = require('../constants/roles');
const generateVerificationCode = require('../utils/generateVerificationCode');

exports.loginWithOAuth = async (req, res) => {
  const { user, jwtToken, refreshJwt } = req.user;

  // Assign a default role if missing
  if (!user.role) {
    const defaultRole = await Role.findOne({ name: ROLES.CLIENT.name }); // Adjust to your system
    if (defaultRole) {
      user.role = defaultRole._id;
      await user.save();
    }
  }

  // Store refresh token in a secure cookie
  res.cookie('refreshToken', refreshJwt, {
    httpOnly: true,
    secure: false,
  });

  // Redirect user to frontend with the access token
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/oauth-callback?accessToken=${jwtToken}`);
};

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

  // Generate a 6-digit verification code
  const verificationCode = generateVerificationCode();

  // ✅ Create new user instance (DO NOT USE User.create())
  const newUser = new User({
    firstName,
    lastName,
    email,
    password, // ✅ This will trigger pre-save middleware to hash it
    phone,
    role: roleDoc._id,
    isVerified: false,
    verificationCode,
    verificationCodeExpire: Date.now() + 10 * 60 * 1000, // Expires in 10 minutes
  });

  // ✅ Save user (TRIGGERS `pre('save')`)
  await newUser.save();

  // Send Email Verification
  await sendEmail({
    to: newUser.email,
    subject: 'Verify Your Email',
    template: 'verify-email',
    data: { verificationCode, name: newUser.firstName },
  });

  res.status(201).json({
    message:
      'User registered successfully. Please check your email for the verification code.',
  });
});

// User Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
    .select('+password')
    .populate('role');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: 'Please verify your email before logging in.' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.json({ message: 'Login successful', accessToken });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'User is already verified.' });
  }

  // Check if the code matches
  if (user.verificationCode !== code) {
    return res.status(400).json({ message: 'Invalid verification code.' });
  }

  // Check if the code has expired
  if (user.verificationCodeExpire && user.verificationCodeExpire < Date.now()) {
    return res.status(400).json({
      message: 'Verification code has expired. Please request a new one.',
    });
  }

  // Mark user as verified and remove the verification code
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();

  res
    .status(200)
    .json({ message: 'Email successfully verified. You can now log in.' });
});

exports.resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'User is already verified.' });
  }

  // Generate a new 6-digit verification code
  const verificationCode = generateVerificationCode();

  // Update user with the new code and expiration time
  user.verificationCode = verificationCode;
  user.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes
  await user.save();

  // Send the new verification email
  await sendEmail({
    to: user.email,
    subject: 'Your New Verification Code',
    template: 'verify-email',
    data: { verificationCode, name: user.firstName },
  });

  res
    .status(200)
    .json({ message: 'A new verification code has been sent to your email.' });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).populate('role'); // Ensure role is populated

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token and hash it
  const { resetToken, hashedToken } = await generateResetToken();

  // Store hashed token and expiry in the database
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Determine which URL to use based on role
  const isClient = user.role?.name === ROLES.CLIENT.name;
  const baseUrl = isClient
    ? process.env.FRONTOFFICE_URL
    : process.env.BACKOFFICE_URL;

  console.log(baseUrl);
  // Reset link with the appropriate frontend URL
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${email}`;

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
      select: 'name address thumbnail', // Customize fields as needed
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
    vipLevel : user.vipLevel,
    points: user.points,  
  };

  res.status(200).json(userData);
});

// Update Profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId; // ✅ cohérent avec getMe

  const updates = req.body;

  if (req.file && req.file.path) {
    updates.image = req.file.path; // Cloudinary URL
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  })
    .select('-password -refreshToken')
    .populate('role', 'name permissions')
    .populate('restaurantId', 'name address');

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    birthday: updatedUser.birthday,
    image: updatedUser.image, // this is now a URL
    role: {
      name: updatedUser.role.name,
      permissions: updatedUser.role.permissions,
    },
    restaurant: updatedUser.restaurantId || null,
  });
});
