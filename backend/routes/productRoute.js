const express = require('express');
const { createProduct, getAllProducts, getProductDetails,  updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();


router.route('/product/new').post(createProduct);

router.route('/products').get(getAllProducts);

router.route('/product/:id').get(getProductDetails);

router.route('/product/:id').put(updateProduct);

router.route('/product/:id').delete(deleteProduct);



module.exports = router;