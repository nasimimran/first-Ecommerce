const express = require('express');
const { createProduct, getAllProducts, getProductDetails,  updateProduct, deleteProduct, createProductReview } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles} = require('../middleware/outh');

const router = express.Router();


router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route('/products').get(getAllProducts);

router.route('/product/:id').get(getProductDetails);

router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route('/product/review').put(isAuthenticatedUser, createProductReview);


module.exports = router;