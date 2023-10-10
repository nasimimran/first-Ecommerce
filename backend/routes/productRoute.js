const express = require('express');
const { createProduct, getAllProducts, getProductDetails,  updateProduct, deleteProduct } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles} = require('../middleware/outh');

const router = express.Router();


router.route('/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route('/products').get(getAllProducts);

router.route('/product/:id').get(getProductDetails);

router.route('/product/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router.route('/product/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);


module.exports = router;