const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getReadings, addReading, getBills, markBillPaid } = require('../controllers/waterController');

router.use(authenticate);

router.get('/readings', authorize('admin'), getReadings);
router.post('/readings', authorize('admin'), addReading);
router.get('/bills', getBills);
router.patch('/bills/:id/pay', authorize('admin'), markBillPaid);

module.exports = router;
