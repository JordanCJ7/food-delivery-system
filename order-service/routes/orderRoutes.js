const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuItemId
 *               - quantity
 *             properties:
 *               menuItemId:
 *                 type: string
 *                 example: "607f1f77bcf86cd799439011"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       500:
 *         description: Server error
 */
router.post('/cart', authMiddleware, roleMiddleware('customer'), cartController.addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the customer's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The cart object
 *       500:
 *         description: Server error
 */
router.get('/cart', authMiddleware, roleMiddleware('customer'), cartController.getCart);

/**
 * @swagger
 * /cart/decrease-quantity:
 *   patch:
 *     summary: Decrease the quantity of an item in the cart (or remove it if quantity is 1)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuItemId
 *             properties:
 *               menuItemId:
 *                 type: string
 *                 example: "607f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Quantity updated successfully or item removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quantity updated successfully
 *                 item:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                       example: "607f1f77bcf86cd799439011"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Server error
 */
router.patch('/cart/decrease-quantity', authMiddleware, roleMiddleware('customer'), cartController.decreaseCartItemQuantity);

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuItemId
 *             properties:
 *               menuItemId:
 *                 type: string
 *                 example: "607f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Server error
 */
router.delete('/cart/remove', authMiddleware, roleMiddleware('customer'), cartController.removeFromCart);

/**
 * @swagger
 * /place:
 *   post:
 *     summary: Place an order from the current cart
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty
 *       500:
 *         description: Server error
 */
router.post('/place', authMiddleware, roleMiddleware('customer'), orderController.placeOrder);

/**
 * @swagger
 * /my-orders:
 *   get:
 *     summary: Get orders of the logged-in customer
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Server error
 */
router.get('/my-orders', authMiddleware, roleMiddleware('customer'), orderController.getMyOrders);

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Modify an existing order (only if it's in 'Pending' status and belongs to the user)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order modified successfully
 *       400:
 *         description: Invalid data or order not modifiable
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
// Modify order (customer only, pending)
router.patch('/:id', authMiddleware, roleMiddleware('customer'), orderController.modifyOrder);

/**
 * @swagger
 * /{id}/status:
 *   patch:
 *     summary: Update the status of an order (based on user role and allowed transitions)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Preparing, Out for Delivery, Completed, Cancelled]
 *                 example: Confirmed
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Invalid transition or unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
// Update status (admin, restaurant_admin, delivery_agent)
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;

// This code defines the routes for the order service in a Node.js application using Express.
// It includes routes for adding items to the cart, removing items from the cart, placing orders, viewing orders, modifying orders, and updating order statuses. 
// The routes are protected by authentication and role-based middleware to ensure that only authorized users can access them. 
// The routes are then exported for use in the main application.
