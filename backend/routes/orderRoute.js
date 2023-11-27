const express = require('express');
const { isAuthenticatedUser, authorizeRoles} = require('../middleware/outh');
const { newOrder, getSingleOrder, myOrders} = require('../controllers/orderController');

const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);

router.route('/order/:id').get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);

router.route('/orders/me').get(isAuthenticatedUser, myOrders);

module.exports = router;