const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const [[adminCount]] = await pool.execute("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    const [[tenantCount]] = await pool.execute("SELECT COUNT(*) as count FROM users WHERE role = 'tenant'");
    const [[houseCount]] = await pool.execute('SELECT COUNT(*) as count FROM houses');
    const [[maintenanceCount]] = await pool.execute("SELECT COUNT(*) as count FROM maintenance_requests WHERE status = 'pending'");
    const [[revenueResult]] = await pool.execute('SELECT COALESCE(SUM(amount_paid), 0) as total FROM rent_payments');

    res.json({
      totalAdmins: adminCount.count,
      totalTenants: tenantCount.count,
      totalHouses: houseCount.count,
      pendingMaintenance: maintenanceCount.count,
      totalRevenue: revenueResult.total,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const [admins] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
        COUNT(DISTINCT h.id) as house_count,
        COUNT(DISTINCT t.id) as tenant_count
       FROM users u
       LEFT JOIN houses h ON h.admin_id = u.id
       LEFT JOIN tenants t ON t.admin_id = u.id
       WHERE u.role = 'admin'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json({ admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const hashed = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), hashed, 'admin', phone || null]
    );

    res.status(201).json({ message: 'Admin account created successfully.', adminId: result.insertId });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Toggle Admin Status
const toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT is_active, role FROM users WHERE id = ? AND role = 'admin'", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const newStatus = !rows[0].is_active;
    await pool.execute('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);

    res.json({ message: `Admin ${newStatus ? 'activated' : 'deactivated'} successfully.`, is_active: newStatus });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Reset Admin Password
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const [rows] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashed = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get All Tenants (system-wide)
const getAllTenants = async (req, res) => {
  try {
    const [tenants] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.phone, u.is_active,
        t.id as tenant_id, t.lease_start, t.lease_end,
        h.house_number, h.rent_amount,
        admin.name as admin_name
       FROM tenants t
       JOIN users u ON u.id = t.user_id
       JOIN houses h ON h.id = t.house_id
       JOIN users admin ON admin.id = t.admin_id
       ORDER BY t.created_at DESC`
    );
    res.json({ tenants });
  } catch (error) {
    console.error('Get all tenants error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get All Houses (system-wide)
const getAllHouses = async (req, res) => {
  try {
    const [houses] = await pool.execute(
      `SELECT h.*, u.name as admin_name, u.email as admin_email
       FROM houses h
       JOIN users u ON u.id = h.admin_id
       ORDER BY h.created_at DESC`
    );
    res.json({ houses });
  } catch (error) {
    console.error('Get all houses error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getDashboardStats,
  getAllAdmins,
  createAdmin,
  toggleAdminStatus,
  resetPassword,
  getAllTenants,
  getAllHouses,
};
