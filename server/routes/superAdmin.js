const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboardStats, getAllAdmins, createAdmin,
  toggleAdminStatus, resetPassword, getAllTenants, getAllHouses
} = require('../controllers/superAdminController');

router.use(authenticate, authorize('super_admin'));

router.get('/dashboard', getDashboardStats);
router.get('/admins', getAllAdmins);
router.post('/admins', createAdmin);
router.patch('/admins/:id/toggle-status', toggleAdminStatus);
router.put('/users/:id/reset-password', resetPassword);
router.get('/tenants', getAllTenants);
router.get('/houses', getAllHouses);

module.exports = router;
