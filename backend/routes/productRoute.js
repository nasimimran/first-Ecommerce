const express = require('express');
const { createProduct, getAllProducts, getProductDetails,  updateProduct, deleteProduct } = require('../controllers/productController');
const { isAuthenticatedUser } = require('../middleware/outh');

const router = express.Router();


router.route('/product/new').post(isAuthenticatedUser ,createProduct);

router.route('/products').get(getAllProducts);

router.route('/product/:id').get(getProductDetails);

router.route('/product/:id').put(isAuthenticatedUser ,updateProduct);

router.route('/product/:id').delete(isAuthenticatedUser ,deleteProduct);


module.exports = router;