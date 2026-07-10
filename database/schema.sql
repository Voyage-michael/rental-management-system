-- ============================================================
-- Rental Management System - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS rental_management;
USE rental_management;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'tenant') NOT NULL DEFAULT 'tenant',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Houses Table
CREATE TABLE IF NOT EXISTS houses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  house_number VARCHAR(50) NOT NULL,
  description TEXT,
  rent_amount DECIMAL(10,2) NOT NULL,
  status ENUM('vacant', 'occupied') NOT NULL DEFAULT 'vacant',
  admin_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  house_id INT NOT NULL,
  admin_id INT NOT NULL,
  lease_start DATE NOT NULL,
  lease_end DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maintenance Requests Table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  admin_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('plumbing', 'electrical', 'structural', 'pest_control', 'cleaning', 'other') NOT NULL DEFAULT 'other',
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'resolved', 'rejected') NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Water Readings Table
CREATE TABLE IF NOT EXISTS water_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  house_id INT NOT NULL,
  admin_id INT NOT NULL,
  previous_reading DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_reading DECIMAL(10,2) NOT NULL,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  rate_per_unit DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Water Bills Table
CREATE TABLE IF NOT EXISTS water_bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reading_id INT NOT NULL,
  house_id INT NOT NULL,
  admin_id INT NOT NULL,
  units_used DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reading_id) REFERENCES water_readings(id) ON DELETE CASCADE,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rent Payments Table
CREATE TABLE IF NOT EXISTS rent_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  admin_id INT NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  expected_amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_date DATE NOT NULL,
  payment_method ENUM('cash', 'mpesa', 'bank_transfer', 'cheque') NOT NULL DEFAULT 'cash',
  reference_number VARCHAR(100),
  notes TEXT,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Insert Super Admin
INSERT INTO users (name, email, password, role) VALUES 
('System Administrator', 'superadmin@rentalsys.com', '$2b$10$YourHashedPasswordHere', 'super_admin');

-- Note: Run the seed script (seed.js) to properly hash passwords
