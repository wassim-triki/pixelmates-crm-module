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

const router = express.Router();

// Public routes
router.post('/signup', signup); // User registration
router.post('/login', login); // User login
router.post('/refresh', refreshToken); // Refresh access token
router.post('/logout', protect, logout); // Logout
router.post('/request-password-reset', requestPasswordReset); // Request password reset
router.post('/reset-password', resetPassword); // Reset password



module.exports = router;
