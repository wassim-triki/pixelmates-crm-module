const express = require('express');
const {
  signup,
  login,
  refreshToken,
  logout,
  resetPassword,
  getMe,
  forgotPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validateSchema = require('../middlewares/validate-schema.middleware');
const {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.post('/signup', validateSchema(signupSchema), signup);
router.post('/login', validateSchema(loginSchema), login);
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
router.post('/refresh', refreshToken);

router.post('/logout', protect, logout);
// auth.routes.js
router.get('/me', protect, getMe);
module.exports = router;
