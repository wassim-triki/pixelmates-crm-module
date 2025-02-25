const express = require('express');
const {
  signup,
  login,
  refreshToken,
  logout,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/signup', signup); // User registration
router.post('/login', login); // User login
router.post('/refresh', refreshToken); // Refresh access token
router.post('/logout', protect, logout); // Logout

module.exports = router;
