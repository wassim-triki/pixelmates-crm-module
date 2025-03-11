const express = require('express');
const passport = require("passport");

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
router.post('/refresh', refreshToken);

router.post('/logout', protect, logout);
// auth.routes.js
router.get('/me', protect, getMe);
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

// 🔹 Connexion Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    res.redirect("http://localhost:4000/dashboard"); // Redirection après connexion
  }
);

// 🔹 Connexion Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    res.redirect("http://localhost:4000/dashboard");
  }
);
module.exports = router;
