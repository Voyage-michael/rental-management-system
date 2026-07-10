const { pool } = require('../config/database');

// Get rent payments
const getPayments = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let query = `
      SELECT rp.*, 
        u.name as tenant_name, u.email as tenant_email,
        h.house_number
       FROM rent_payments rp
       JOIN tenants t ON t.id = rp.tenant_id
       JOIN users u ON u.id = t.user_id
       JOIN houses h ON h.id = t.house_id
    `;
    const params = [];

    if (role === 'admin') {
      query += ' WHERE rp.admin_id = ?';
      params.push(userId);
    } else if (role === 'tenant') {
      query += ' WHERE t.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY rp.payment_date DESC';

    const [payments] = await pool.execute(query, params);
    res.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Record rent payment
const recordPayment = async (req, res) => {
  try {
    const { tenant_id, amount_paid, payment_date, payment_method, reference_number, notes, month } = req.body;
    const adminId = req.user.id;

    if (!tenant_id || !amount_paid || !payment_date || !month) {
      return res.status(400).json({ message: 'Tenant, amount, payment date, and month are required.' });
    }

    // Validate tenant belongs to admin & get house rent
    const [tenantRows] = await pool.execute(
      `SELECT t.id, h.rent_amount 
       FROM tenants t 
       JOIN houses h ON h.id = t.house_id
       WHERE t.id = ? AND t.admin_id = ?`,
      [tenant_id, adminId]
    );
    if (tenantRows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const expected = parseFloat(tenantRows[0].rent_amount);
    const paid = parseFloat(amount_paid);
    const balance = expected - paid;

    const [result] = await pool.execute(
      `INSERT INTO rent_payments 
       (tenant_id, admin_id, amount_paid, expected_amount, balance, payment_date, payment_method, reference_number, notes, month)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tenant_id, adminId, paid, expected, balance, payment_date, payment_method || 'cash',
       reference_number || null, notes || null, month]
    );

    res.status(201).json({
      message: 'Payment recorded successfully.',
      paymentId: result.insertId,
      balance,
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get admin dashboard stats
const getAdminDashboard = async (req, res) => {
  try {
    const adminId = req.user.id;

    const [[houseCount]] = await pool.execute(
      'SELECT COUNT(*) as total, SUM(status = "occupied") as occupied, SUM(status = "vacant") as vacant FROM houses WHERE admin_id = ?',
      [adminId]
    );
    const [[tenantCount]] = await pool.execute(
      'SELECT COUNT(*) as count FROM tenants WHERE admin_id = ? AND lease_end IS NULL',
      [adminId]
    );
    const [[maintenanceCount]] = await pool.execute(
      'SELECT COUNT(*) as count FROM maintenance_requests WHERE admin_id = ? AND status = "pending"',
      [adminId]
    );
    const [[revenueResult]] = await pool.execute(
      'SELECT COALESCE(SUM(amount_paid), 0) as total FROM rent_payments WHERE admin_id = ?',
      [adminId]
    );
    const [[unpaidBills]] = await pool.execute(
      'SELECT COUNT(*) as count FROM water_bills WHERE admin_id = ? AND is_paid = FALSE',
      [adminId]
    );

    // Recent payments
    const [recentPayments] = await pool.execute(
      `SELECT rp.amount_paid, rp.payment_date, rp.month, u.name as tenant_name, h.house_number
       FROM rent_payments rp
       JOIN tenants t ON t.id = rp.tenant_id
       JOIN users u ON u.id = t.user_id
       JOIN houses h ON h.id = t.house_id
       WHERE rp.admin_id = ?
       ORDER BY rp.created_at DESC LIMIT 5`,
      [adminId]
    );

    res.json({
      totalHouses: houseCount.total,
      occupiedHouses: houseCount.occupied,
      vacantHouses: houseCount.vacant,
      activeTenants: tenantCount.count,
      pendingMaintenance: maintenanceCount.count,
      totalRevenue: revenueResult.total,
      unpaidWaterBills: unpaidBills.count,
      recentPayments,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getPayments, recordPayment, getAdminDashboard };
