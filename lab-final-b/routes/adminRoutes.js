const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getDashboard);

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);


router.get('/edit-product/:id', adminController.getEditProduct);
router.post('/edit-product/:id', adminController.postEditProduct);


router.get('/delete-product/:id', adminController.deleteProduct);

router.get('/orders', adminController.getAdminOrders);
router.post('/update-status', adminController.postUpdateStatus);

module.exports = router;
