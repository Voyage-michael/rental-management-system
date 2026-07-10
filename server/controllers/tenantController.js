const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Get all tenants for admin
const getTenants = async (req, res) => {
  try {
    const adminId = req.user.id;
    const [tenants] = await pool.execute(
      `SELECT t.id, t.lease_start, t.lease_end, t.created_at,
        u.id as user_id, u.name, u.email, u.phone, u.is_active,
        h.id as house_id, h.house_number, h.rent_amount
       FROM tenants t
       JOIN users u ON u.id = t.user_id
       JOIN houses h ON h.id = t.house_id
       WHERE t.admin_id = ?
       ORDER BY t.created_at DESC`,
      [adminId]
    );
    res.json({ tenants });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single tenant
const getTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [rows] = await pool.execute(
      `SELECT t.id, t.lease_start, t.lease_end,
        u.id as user_id, u.name, u.email, u.phone,
        h.id as house_id, h.house_number, h.rent_amount
       FROM tenants t
       JOIN users u ON u.id = t.user_id
       JOIN houses h ON h.id = t.house_id
       WHERE t.id = ? AND t.admin_id = ?`,
      [id, adminId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Tenant not found.' });
    res.json({ tenant: rows[0] });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create tenant (register new user + assign house)
const createTenant = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, phone, password, house_id, lease_start, lease_end } = req.body;
    const adminId = req.user.id;

    if (!name || !email || !password || !house_id || !lease_start) {
      return res.status(400).json({ message: 'Name, email, password, house, and lease start are required.' });
    }

    // Check email unique
    const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Check house belongs to admin and is vacant
    const [houseRows] = await connection.execute(
      'SELECT id, status FROM houses WHERE id = ? AND admin_id = ?',
      [house_id, adminId]
    );
    if (houseRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'House not found.' });
    }
    if (houseRows[0].status === 'occupied') {
      await connection.rollback();
      return res.status(400).json({ message: 'House is already occupied.' });
    }

    // Create user
    const hashed = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), hashed, 'tenant', phone || null]
    );

    // Create tenant record
    const [tenantResult] = await connection.execute(
      'INSERT INTO tenants (user_id, house_id, admin_id, lease_start, lease_end) VALUES (?, ?, ?, ?, ?)',
      [userResult.insertId, house_id, adminId, lease_start, lease_end || null]
    );

    // Mark house as occupied
    await connection.execute('UPDATE houses SET status = ? WHERE id = ?', ['occupied', house_id]);

    await connection.commit();
    res.status(201).json({ message: 'Tenant registered successfully.', tenantId: tenantResult.insertId });
  } catch (error) {
    await connection.rollback();
    console.error('Create tenant error:', error);
    res.status(500).json({ message: 'Server error.' });
  } finally {
    connection.release();
  }
};

// Update tenant
const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, lease_end } = req.body;
    const adminId = req.user.id;

    const [rows] = await pool.execute(
      'SELECT t.user_id FROM tenants t WHERE t.id = ? AND t.admin_id = ?',
      [id, adminId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Tenant not found.' });

    await pool.execute('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone || null, rows[0].user_id]);
    if (lease_end) {
      await pool.execute('UPDATE tenants SET lease_end = ? WHERE id = ?', [lease_end, id]);
    }

    res.json({ message: 'Tenant updated successfully.' });
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Vacate tenant (terminate lease)
const vacateTenant = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const adminId = req.user.id;

    const [rows] = await connection.execute(
      'SELECT t.house_id FROM tenants t WHERE t.id = ? AND t.admin_id = ?',
      [id, adminId]
    );
    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    await connection.execute('UPDATE tenants SET lease_end = ? WHERE id = ?', [today, id]);
    await connection.execute('UPDATE houses SET status = ? WHERE id = ?', ['vacant', rows[0].house_id]);

    await connection.commit();
    res.json({ message: 'Tenant vacated successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error('Vacate tenant error:', error);
    res.status(500).json({ message: 'Server error.' });
  } finally {
    connection.release();
  }
};

// Get tenant's own profile (for tenant role)
const getMyProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT t.id, t.lease_start, t.lease_end,
        u.name, u.email, u.phone,
        h.house_number, h.rent_amount,
        admin.name as landlord_name, admin.phone as landlord_phone
       FROM tenants t
       JOIN users u ON u.id = t.user_id
       JOIN houses h ON h.id = t.house_id
       JOIN users admin ON admin.id = t.admin_id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC LIMIT 1`,
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Tenant profile not found.' });
    res.json({ tenant: rows[0] });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getTenants, getTenant, createTenant, updateTenant, vacateTenant, getMyProfile };
