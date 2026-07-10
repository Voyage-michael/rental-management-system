const { pool } = require('../config/database');

// Get water readings for admin
const getReadings = async (req, res) => {
  try {
    const adminId = req.user.id;
    const [readings] = await pool.execute(
      `SELECT wr.*, h.house_number,
        wb.id as bill_id, wb.units_used, wb.total_amount, wb.is_paid
       FROM water_readings wr
       JOIN houses h ON h.id = wr.house_id
       LEFT JOIN water_bills wb ON wb.reading_id = wr.id
       WHERE wr.admin_id = ?
       ORDER BY wr.created_at DESC`,
      [adminId]
    );
    res.json({ readings });
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add water reading (auto-generates bill)
const addReading = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { house_id, previous_reading, current_reading, month, rate_per_unit } = req.body;
    const adminId = req.user.id;

    if (!house_id || current_reading === undefined || !month) {
      return res.status(400).json({ message: 'House, current reading, and month are required.' });
    }

    // Validate house belongs to admin
    const [houseRows] = await connection.execute(
      'SELECT id FROM houses WHERE id = ? AND admin_id = ?',
      [house_id, adminId]
    );
    if (houseRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'House not found.' });
    }

    // Check duplicate for same month
    const [dupCheck] = await connection.execute(
      'SELECT id FROM water_readings WHERE house_id = ? AND month = ?',
      [house_id, month]
    );
    if (dupCheck.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: 'Reading already exists for this house and month.' });
    }

    const rate = parseFloat(rate_per_unit) || 50;
    const prev = parseFloat(previous_reading) || 0;
    const curr = parseFloat(current_reading);

    if (curr < prev) {
      await connection.rollback();
      return res.status(400).json({ message: 'Current reading cannot be less than previous reading.' });
    }

    // Insert reading
    const [readingResult] = await connection.execute(
      'INSERT INTO water_readings (house_id, admin_id, previous_reading, current_reading, month, rate_per_unit) VALUES (?, ?, ?, ?, ?, ?)',
      [house_id, adminId, prev, curr, month, rate]
    );

    // Auto-generate bill
    const units_used = curr - prev;
    const total_amount = units_used * rate;

    await connection.execute(
      'INSERT INTO water_bills (reading_id, house_id, admin_id, units_used, total_amount) VALUES (?, ?, ?, ?, ?)',
      [readingResult.insertId, house_id, adminId, units_used, total_amount]
    );

    await connection.commit();
    res.status(201).json({
      message: 'Water reading recorded and bill generated.',
      readingId: readingResult.insertId,
      bill: { units_used, total_amount }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Add reading error:', error);
    res.status(500).json({ message: 'Server error.' });
  } finally {
    connection.release();
  }
};

// Get water bills
const getBills = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let query = `
      SELECT wb.*, h.house_number, wr.month, wr.previous_reading, wr.current_reading, wr.rate_per_unit
       FROM water_bills wb
       JOIN houses h ON h.id = wb.house_id
       JOIN water_readings wr ON wr.id = wb.reading_id
    `;
    const params = [];

    if (role === 'admin') {
      query += ' WHERE wb.admin_id = ?';
      params.push(userId);
    } else if (role === 'tenant') {
      // Get tenant's house
      const [tenantRows] = await pool.execute(
        'SELECT house_id FROM tenants WHERE user_id = ? AND lease_end IS NULL ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      if (tenantRows.length === 0) return res.json({ bills: [] });

      query += ' WHERE wb.house_id = ?';
      params.push(tenantRows[0].house_id);
    }

    query += ' ORDER BY wb.created_at DESC';

    const [bills] = await pool.execute(query, params);
    res.json({ bills });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Mark bill as paid
const markBillPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [result] = await pool.execute(
      'UPDATE water_bills SET is_paid = TRUE, paid_at = NOW() WHERE id = ? AND admin_id = ?',
      [id, adminId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Bill not found.' });

    res.json({ message: 'Bill marked as paid.' });
  } catch (error) {
    console.error('Mark bill paid error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getReadings, addReading, getBills, markBillPaid };
