const express = require('express');
const router = express.Router();
const { login, register, getProfile, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate, getProfile);
router.put('/change-password', authenticate, changePassword);

module.exports = router;
