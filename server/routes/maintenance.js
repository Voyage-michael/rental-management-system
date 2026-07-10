const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getRequests, createRequest, updateRequestStatus } = require('../controllers/maintenanceController');

router.use(authenticate);

router.get('/', getRequests);
router.post('/', authorize('tenant'), createRequest);
router.patch('/:id/status', authorize('admin'), updateRequestStatus);

module.exports = router;
