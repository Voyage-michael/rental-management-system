const { pool } = require('../config/database');

// Get houses for admin
const getHouses = async (req, res) => {
  try {
    const adminId = req.user.role === 'super_admin' ? null : req.user.id;
    let query = `SELECT h.*, 
      CASE WHEN t.id IS NOT NULL THEN u.name ELSE NULL END as tenant_name,
      CASE WHEN t.id IS NOT NULL THEN u.email ELSE NULL END as tenant_email
      FROM houses h
      LEFT JOIN tenants t ON t.house_id = h.id AND t.lease_end IS NULL
      LEFT JOIN users u ON u.id = t.user_id`;
    
    const params = [];
    if (adminId) {
      query += ' WHERE h.admin_id = ?';
      params.push(adminId);
    }
    query += ' ORDER BY h.created_at DESC';

    const [houses] = await pool.execute(query, params);
    res.json({ houses });
  } catch (error) {
    console.error('Get houses error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single house
const getHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.role === 'super_admin' ? null : req.user.id;

    let query = 'SELECT * FROM houses WHERE id = ?';
    const params = [id];

    if (adminId) {
      query += ' AND admin_id = ?';
      params.push(adminId);
    }

    const [rows] = await pool.execute(query, params);
    if (rows.length === 0) return res.status(404).json({ message: 'House not found.' });

    res.json({ house: rows[0] });
  } catch (error) {
    console.error('Get house error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create house
const createHouse = async (req, res) => {
  try {
    const { house_number, description, rent_amount } = req.body;

    if (!house_number || !rent_amount) {
      return res.status(400).json({ message: 'House number and rent amount are required.' });
    }

    const admin_id = req.user.id;

    // Check duplicate
    const [existing] = await pool.execute(
      'SELECT id FROM houses WHERE house_number = ? AND admin_id = ?',
      [house_number, admin_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'House number already exists.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO houses (house_number, description, rent_amount, admin_id) VALUES (?, ?, ?, ?)',
      [house_number, description || null, rent_amount, admin_id]
    );

    res.status(201).json({ message: 'House created successfully.', houseId: result.insertId });
  } catch (error) {
    console.error('Create house error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update house
const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { house_number, description, rent_amount, status } = req.body;
    const adminId = req.user.id;

    const [rows] = await pool.execute('SELECT id FROM houses WHERE id = ? AND admin_id = ?', [id, adminId]);
    if (rows.length === 0) return res.status(404).json({ message: 'House not found.' });

    await pool.execute(
      'UPDATE houses SET house_number = ?, description = ?, rent_amount = ?, status = ? WHERE id = ?',
      [house_number, description || null, rent_amount, status, id]
    );

    res.json({ message: 'House updated successfully.' });
  } catch (error) {
    console.error('Update house error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete house
const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [tenants] = await pool.execute(
      'SELECT id FROM tenants WHERE house_id = ? AND lease_end IS NULL',
      [id]
    );
    if (tenants.length > 0) {
      return res.status(400).json({ message: 'Cannot delete house with active tenants.' });
    }

    const [result] = await pool.execute('DELETE FROM houses WHERE id = ? AND admin_id = ?', [id, adminId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'House not found.' });

    res.json({ message: 'House deleted successfully.' });
  } catch (error) {
    console.error('Delete house error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getHouses, getHouse, createHouse, updateHouse, deleteHouse };
