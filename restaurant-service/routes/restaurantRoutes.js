const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const restaurantController = require('../controllers/restaurantController');
const menuController = require('../controllers/menuController');

/**
 * @swagger
 * tags:
 *   - name: Restaurants
 *     description: Restaurant operations
 *   - name: Menu
 *     description: Menu operations
 */

/**
 * @swagger
 * /api/restaurants/register:
 *   post:
 *     summary: Register a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/register',  // <-- Fixed this line by removing the redundant /restaurants
  authMiddleware,
  roleMiddleware('restaurant_admin'),
  restaurantController.registerRestaurant
);

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 *       500:
 *         description: Internal server error
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', restaurantController.getRestaurantById);

/**
 * @swagger
 * /api/restaurants/{id}/status:
 *   patch:
 *     summary: Toggle the open/closed status of a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant status updated
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id/status',
  authMiddleware,
  restaurantController.toggleStatus
);

/**
 * @swagger
 * /api/restaurants/{id}/verify:
 *   patch:
 *     summary: Verify a restaurant (admin only)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant verified successfully
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id/verify',
  authMiddleware,
  roleMiddleware('admin'),
  restaurantController.verifyRestaurant
);

/**
 * @swagger
 * /api/restaurants/{id}/menu:
 *   post:
 *     summary: Add a menu item to a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:id/menu',
  authMiddleware,
  roleMiddleware('restaurant_admin'),
  menuController.addMenuItem
);

/**
 * @swagger
 * /api/restaurants/{id}/menu:
 *   get:
 *     summary: Get all menu items for a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: List of menu items for the restaurant
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id/menu', menuController.getMenu);

/**
 * @swagger
 * /api/restaurants/menu/{menuId}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/menu/:menuId',
  authMiddleware,
  roleMiddleware('restaurant_admin'),
  menuController.updateMenuItem
);

/**
 * @swagger
 * /api/restaurants/menu/{menuId}/toggle-availability:
 *   patch:
 *     summary: Toggle the availability status of a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menu item availability status updated
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/menu/:menuId/toggle-availability',
  authMiddleware,
  menuController.toggleAvailability
);

/**
 * @swagger
 * /api/restaurants/menu/{menuId}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/menu/:menuId',
  authMiddleware,
  roleMiddleware('restaurant_admin'),
  menuController.deleteMenuItem
);

module.exports = router;
