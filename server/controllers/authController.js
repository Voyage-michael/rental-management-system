const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');
const sendEmail = require('../services/emailService');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful.',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, phone, is_active, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const [rows] = await pool.execute('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isValid = await bcrypt.compare(currentPassword, rows[0].password);

    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required.'
      });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    

    // Don't reveal whether the email exists
    if (rows.length === 0) {
      return res.json({
        message: 'If that email exists, a password reset link has been sent.'
      });
    }

    const user = rows[0];

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing it
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token expires in 1 hour
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await pool.execute(
      `UPDATE users
       SET reset_token = ?, reset_token_expires = ?
       WHERE id = ?`,
      [hashedToken, expires, user.id]
    );

    const resetLink =
      `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      'Reset Your RentFlow Password',
      `
        <h2>Hello ${user.name},</h2>

        <p>You requested a password reset.</p>

        <p>
          <a href="${resetLink}">
            Click here to reset your password
          </a>
        </p>

        <p>This link expires in one hour.</p>

        <p>If you didn't request this, simply ignore this email.</p>
      `
    );

    res.json({
      message: 'If that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);

    res.status(500).json({
      message: 'Server error.'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters."
      });
    }

    // Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("Hashed token:", hashedToken);

    // Find matching user
    const [rows] = await pool.execute(
      `SELECT id
       FROM users
       WHERE reset_token = ?
       AND reset_token_expires > NOW()`,
      [hashedToken]
    );

    console.log("Database rows:", rows);

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired."
      });
    }

    const user = rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS) || 10
    );

    // Update password & clear token
    await pool.execute(
      `UPDATE users
       SET password = ?,
           reset_token = NULL,
           reset_token_expires = NULL
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    res.json({
      message: "Password reset successfully. You can now log in."
    });

  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check email uniqueness
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Hash password and create admin account
    const hashed = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashed, 'admin']
    );

    res.status(201).json({
      message: 'Account created successfully. You can now log in.',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

module.exports = { login, register, getProfile, changePassword, forgotPassword, resetPassword };
