const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');

router.post('/cart', authMiddleware, roleMiddleware('customer'), cartController.addToCart);
router.get('/cart', authMiddleware, roleMiddleware('customer'), cartController.getCart);

router.post('/place', authMiddleware, roleMiddleware('customer'), orderController.placeOrder);
router.get('/my-orders', authMiddleware, roleMiddleware('customer'), orderController.getMyOrders);

module.exports = router;
