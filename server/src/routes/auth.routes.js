const express = require('express');
const passport = require('passport');
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); // adjust if your path differs
const upload = multer({ storage });

const {
  signup,
  login,
  refreshToken,
  logout,
  resetPassword,
  getMe,
  forgotPassword,
  verifyEmail,
  resendVerificationEmail,
  loginWithOAuth,
  updateProfile,
} = require('../controllers/auth.controller');

const { protect } = require('../middlewares/auth.middleware');
const validateSchema = require('../middlewares/validate-schema.middleware');
const {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  verifyEmailSchema,
} = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.post('/signup', validateSchema(signupSchema), signup);
router.post('/login', validateSchema(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/verify-email', validateSchema(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Authenticated routes
router.post('/logout', logout);
router.get('/me', protect, getMe);

// ✅ Profile update with file upload via Cloudinary
router.put('/me/update', protect, upload.single('image'), updateProfile);

// Password recovery
router.post(
  '/reset-password',
  validateSchema(resetPasswordSchema),
  resetPassword
);
router.post(
  '/forgot-password',
  validateSchema(forgotPasswordSchema),
  forgotPassword
);

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  loginWithOAuth
);

// Facebook OAuth Routes
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  loginWithOAuth
);

module.exports = router;
