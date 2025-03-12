const express = require('express');
const passport = require('passport');
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
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

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

module.exports = router;
