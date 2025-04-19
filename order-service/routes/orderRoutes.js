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
// This code defines the routes for the order service in a Node.js application using Express.
// It includes routes for adding items to the cart, retrieving the cart, placing an order, and getting the user's orders. 
// The routes are protected by authentication and role-based middleware to ensure that only customers can access them. 
// Finally, the router is exported for use in other parts of the application.