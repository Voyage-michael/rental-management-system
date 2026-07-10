const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getTenants, getTenant, createTenant, updateTenant, vacateTenant, getMyProfile } = require('../controllers/tenantController');

router.use(authenticate);

router.get('/my-profile', authorize('tenant'), getMyProfile);
router.get('/', authorize('admin', 'super_admin'), getTenants);
router.get('/:id', authorize('admin', 'super_admin'), getTenant);
router.post('/', authorize('admin'), createTenant);
router.put('/:id', authorize('admin'), updateTenant);
router.patch('/:id/vacate', authorize('admin'), vacateTenant);

module.exports = router;
