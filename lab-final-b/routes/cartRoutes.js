const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.post('/', cartController.postCart);
router.post('/delete-item', cartController.postCartDeleteProduct);

module.exports = router;
