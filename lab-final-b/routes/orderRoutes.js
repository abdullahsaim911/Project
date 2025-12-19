const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/preview', orderController.getOrderPreview);
router.post('/confirm', orderController.postConfirmOrder);

router.get('/my-orders', orderController.getMyOrdersSearch);
router.post('/my-orders', orderController.postMyOrdersResults);

module.exports = router;