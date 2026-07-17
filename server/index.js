require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const authRoutes = require('./routes/auth');
const superAdminRoutes = require('./routes/superAdmin');
const houseRoutes = require('./routes/houses');
const tenantRoutes = require('./routes/tenants');
const maintenanceRoutes = require('./routes/maintenance');
const waterRoutes = require('./routes/water');
const rentRoutes = require('./routes/rent');

// Email Service
const sendEmail = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://rental-management-system-oxs2.vercel.app'
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/rent', rentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found.',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    message: 'Internal server error.',
  });
});

// Start server
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});