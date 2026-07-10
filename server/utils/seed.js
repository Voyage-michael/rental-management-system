require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const seed = async () => {
  try {
    console.log('🌱 Seeding database...');
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;

    const superAdminPassword = await bcrypt.hash('SuperAdmin@123', rounds);
    const adminPassword = await bcrypt.hash('Admin@123', rounds);
    const tenantPassword = await bcrypt.hash('Tenant@123', rounds);

    // Super Admin
    await pool.execute(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      ['System Administrator', 'superadmin@rentalsys.com', superAdminPassword, 'super_admin']
    );

    // Demo Admin (Landlord)
    const [adminResult] = await pool.execute(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      ['John Mwangi', 'admin@demo.com', adminPassword, 'admin', '+254712345678']
    );

    const adminId = adminResult.insertId || (await pool.execute(
      'SELECT id FROM users WHERE email = ?', ['admin@demo.com']
    ))[0][0].id;

    // Demo Houses
    const [house1] = await pool.execute(
      `INSERT INTO houses (house_number, description, rent_amount, admin_id) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE house_number = VALUES(house_number)`,
      ['A1', 'One bedroom unit, ground floor', 15000, adminId]
    );
    const [house2] = await pool.execute(
      `INSERT INTO houses (house_number, description, rent_amount, admin_id) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE house_number = VALUES(house_number)`,
      ['A2', 'One bedroom unit, first floor', 15000, adminId]
    );
    const [house3] = await pool.execute(
      `INSERT INTO houses (house_number, description, rent_amount, admin_id) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE house_number = VALUES(house_number)`,
      ['B1', 'Two bedroom unit, ground floor', 25000, adminId]
    );

    // Demo Tenant
    const [tenantUser] = await pool.execute(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      ['Jane Kamau', 'tenant@demo.com', tenantPassword, 'tenant', '+254723456789']
    );

    const tenantUserId = tenantUser.insertId || (await pool.execute(
      'SELECT id FROM users WHERE email = ?', ['tenant@demo.com']
    ))[0][0].id;

    const houseId = house1.insertId || (await pool.execute(
      'SELECT id FROM houses WHERE house_number = ? AND admin_id = ?', ['A1', adminId]
    ))[0][0].id;

    // Only create tenant record if user was actually inserted
    if (tenantUser.insertId) {
      await pool.execute(
        'INSERT INTO tenants (user_id, house_id, admin_id, lease_start) VALUES (?, ?, ?, ?)',
        [tenantUserId, houseId, adminId, '2024-01-01']
      );
      await pool.execute('UPDATE houses SET status = ? WHERE id = ?', ['occupied', houseId]);
    }

    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📋 Demo Credentials:');
    console.log('  Super Admin → superadmin@rentalsys.com / SuperAdmin@123');
    console.log('  Admin       → admin@demo.com / Admin@123');
    console.log('  Tenant      → tenant@demo.com / Tenant@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
