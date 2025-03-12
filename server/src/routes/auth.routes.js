const express = require('express');
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
} = require('../controllers/auth.controller');

const { protect } = require('../middlewares/auth.middleware');
const validateSchema = require('../middlewares/validate-schema.middleware');
const {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  verifyEmailSchema, // New validator for email verification
} = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.post('/signup', validateSchema(signupSchema), signup);
router.post('/login', validateSchema(loginSchema), login);
router.post('/refresh', refreshToken);

// Email verification routes
router.post('/verify-email', validateSchema(verifyEmailSchema), verifyEmail); // Use a POST request since we send data
router.post('/resend-verification', resendVerificationEmail);

// Authenticated routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Password recovery routes
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

module.exports = router;
