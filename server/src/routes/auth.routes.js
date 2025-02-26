const express = require('express');
const {
  signup,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
} = require('../validators/user.validator');

const router = express.Router();

// Public routes
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  resetPassword
);
router.post('/refresh', refreshToken);
router.post('/request-password-reset', requestPasswordReset);
router.post('/logout', protect, logout);
// auth.routes.js
router.get('/me', protect, getMe);
module.exports = router;
