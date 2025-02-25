const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');



// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );
};
// Configuration de l'envoi d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};

// User Registration
// TODO: add validation middleware so can use req.body directly
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ firstName, lastName, email, phone, password, role });

    // await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('role');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      // sameSite: 'strict',
    });
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error', stack: err.stack });
  }
};

// Token Refresh
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(403).json({ message: 'No refresh token' });

    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Token expired' });

      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

// Demander la réinitialisation du mot de passe
exports.requestPasswordReset= async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Received password reset request for email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
   const token = jwt.sign({ userId: user._id }, process.env.JWT_RESET_PASSWORD_SECRET, { expiresIn: '1h' });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: user.email,
    //   subject: 'Password Reset Request',
    //   text: `You requested a password reset. Please use the following token to reset your password: ${token}`,
    // };

    // await transporter.sendMail(mailOptions);

    // res.status(200).json({ message: 'Password reset email sent' });
 // Génération du lien de réinitialisation
 const resetLink = `http://localhost:3000/reset-password?token=${token}`;

 // Retourner le lien au lieu du token brut
 res.status(200).json({ message: 'Password reset link generated', resetLink });  } catch (error) {
    console.error(`Error processing password reset request: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);

    // Trouver l'utilisateur correspondant
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Invalid or expired token' });
  }
};
