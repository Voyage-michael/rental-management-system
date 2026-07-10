const { pool } = require('../config/database');

// Get maintenance requests
const getRequests = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let query = `
      SELECT mr.*, 
        u.name as tenant_name, u.email as tenant_email,
        h.house_number
       FROM maintenance_requests mr
       JOIN tenants t ON t.id = mr.tenant_id
       JOIN users u ON u.id = t.user_id
       JOIN houses h ON h.id = t.house_id
    `;
    const params = [];

    if (role === 'admin') {
      query += ' WHERE mr.admin_id = ?';
      params.push(userId);
    } else if (role === 'tenant') {
      query += ' WHERE t.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY mr.created_at DESC';

    const [requests] = await pool.execute(query, params);
    res.json({ requests });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Submit maintenance request (tenant)
const createRequest = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    // Get tenant record
    const [tenantRows] = await pool.execute(
      'SELECT id, admin_id FROM tenants WHERE user_id = ? AND lease_end IS NULL ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (tenantRows.length === 0) {
      return res.status(400).json({ message: 'No active lease found.' });
    }

    const { id: tenant_id, admin_id } = tenantRows[0];

    const [result] = await pool.execute(
      'INSERT INTO maintenance_requests (tenant_id, admin_id, title, description, category, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [tenant_id, admin_id, title, description, category || 'other', priority || 'medium']
    );

    res.status(201).json({ message: 'Maintenance request submitted.', requestId: result.insertId });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update request status (admin)
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    const adminId = req.user.id;

    const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const [result] = await pool.execute(
      'UPDATE maintenance_requests SET status = ?, admin_notes = ? WHERE id = ? AND admin_id = ?',
      [status, admin_notes || null, id, adminId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Request not found.' });

    res.json({ message: 'Request updated successfully.' });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getRequests, createRequest, updateRequestStatus };
