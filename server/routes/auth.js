const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

const {
  login,
  register,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = authController;

const { authenticate } = require('../middleware/auth');

// =========================
// Public Routes
// =========================
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// =========================
// Protected Routes
// =========================
router.get('/profile', authenticate, getProfile);
router.put('/change-password', authenticate, changePassword);


module.exports = router;