const express = require('express');
const {
  signup,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validate-request.middleware');
const {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  req,
  requestPasswordResetSchema,
} = require('../validators/auth.validator');

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
router.post(
  '/request-password-reset',
  validateRequest(requestPasswordResetSchema),
  requestPasswordReset
);
router.post('/logout', protect, logout);

module.exports = router;
