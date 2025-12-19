const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const productController = require('../controllers/productController');

router.get('/', pageController.getHome);
router.get('/works', pageController.getWorks);
router.get('/about', pageController.getAbout);
router.get('/contact', pageController.getContact);
router.get('/shop', productController.getProducts);

module.exports = router;
