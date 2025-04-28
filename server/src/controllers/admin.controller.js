// controllers/authController.js
const Role = require('../models/Role');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant'); // ← new import
const asyncHandler = require('../utils/asyncHandler');
const generateVerificationCode = require('../utils/generateVerificationCode');
const sendEmail = require('../utils/sendEmail');

exports.signup = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    restaurantName, // ← expect this from the front end
    phone,
  } = req.body;

  console.log('Received signup data:', req.body);

  // 1) check for existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // 2) look up admin role
  const adminRole = await Role.findOne({ name: 'Admin' });
  if (!adminRole) {
    return res.status(500).json({ message: 'Admin role not configured' });
  }

  // 3) create a minimalist restaurant record
  const newRestaurant = new Restaurant({
    name: restaurantName,
    // you can add real values here or collect them later in a settings flow
    address: '',
    cuisineType: '',
    taxeTPS: 0,
    taxeTVQ: 0,
  });
  await newRestaurant.save();

  // 4) generate verification code
  const verificationCode = generateVerificationCode();

  // 5) build & save new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: adminRole._id,
    restaurantId: newRestaurant._id, // ← link the restaurant
    isVerified: true, //FOR TESTING ONLY, REMOVE LATER
    verificationCode,
    verificationCodeExpire: Date.now() + 10 * 60 * 1000,
  });
  await newUser.save();

  // 6) send the verification email
  await sendEmail({
    to: newUser.email,
    subject: 'Verify Your Email',
    template: 'verify-email',
    data: { verificationCode, name: newUser.firstName },
  });

  // 7) respond
  res.status(201).json({
    message:
      'Registration successful. Please check your email for the verification code.',
  });
});
