const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getPayments, recordPayment, getAdminDashboard } = require('../controllers/rentController');

router.use(authenticate);

router.get('/dashboard', authorize('admin'), getAdminDashboard);
router.get('/', getPayments);
router.post('/', authorize('admin'), recordPayment);

module.exports = router;
