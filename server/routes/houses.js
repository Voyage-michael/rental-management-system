const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getHouses, getHouse, createHouse, updateHouse, deleteHouse } = require('../controllers/houseController');

router.use(authenticate);

router.get('/', getHouses);
router.get('/:id', getHouse);
router.post('/', authorize('admin'), createHouse);
router.put('/:id', authorize('admin'), updateHouse);
router.delete('/:id', authorize('admin'), deleteHouse);

module.exports = router;
