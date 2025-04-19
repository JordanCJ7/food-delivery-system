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

// Modify order (customer only, pending)
router.patch('/:id', authMiddleware, roleMiddleware('customer'), orderController.modifyOrder);
// Update status (admin, restaurant_admin, delivery_agent)
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
// This code defines the routes for the order service in a Node.js application using Express.
// It includes routes for adding items to the cart, placing orders, viewing orders, modifying orders, and updating order statuses. 
// The routes are protected by authentication and role-based middleware to ensure that only authorized users can access them. 
// The routes are then exported for use in the main application.
