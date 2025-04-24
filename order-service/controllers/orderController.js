const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment'); // Import Payment model

/**
 * Place Order - Customer Only
 * Creates a new order using the customer's cart, calculates total price,
 * saves the order, and clears the cart.
 */
exports.placeOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const cart = await Cart.findOne({ customerId }).populate('items.menuItemId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.menuItemId.price * item.quantity, 0
    );

    // Verify payment
    const payment = await Payment.findOne({ customerId, status: 'verified', amount: totalPrice });
    if (!payment) {
      return res.status(400).json({ error: 'Payment not verified or insufficient amount' });
    }

    const restaurantId = cart.items[0].menuItemId.restaurantId;
    const items = cart.items.map(item => ({
      menuItemId: item.menuItemId._id,
      quantity: item.quantity
    }));

    const order = await Order.create({
      customerId,
      restaurantId,
      items,
      totalPrice
    });

    await Cart.deleteOne({ customerId });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get My Orders - Customer Only
 * Retrieves all orders placed by the currently authenticated customer.
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).populate('items.menuItemId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modify Order - Customer Only
exports.modifyOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.customerId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order can only be modified while pending' });
    }

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array required' });
    }

    order.items = items;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Order Status - Role-based
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const currentStatus = order.status;
    const newStatus = req.body.status?.toLowerCase();  // normalize input
    const userRole = req.user.role;

    const validTransitions = {
      restaurant_admin: {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['preparing'],
        preparing: ['completed'],
        accepted: ['dispatched']
      },
      delivery_person: {
        completed: ['accepted', 'cancelled'],
        dispatched: ['delivered']
      },
      admin: {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['preparing', 'cancelled'],
        preparing: ['completed'],
        completed: ['accepted', 'cancelled'],
        accepted: ['dispatched'],
        dispatched: ['delivered']
      }
    };

    const isValid = () => {
      const transitions = validTransitions[userRole]?.[currentStatus];
      if (!transitions) return false;
      return Array.isArray(transitions)
        ? transitions.includes(newStatus)
        : transitions === newStatus;
    };

    if (!isValid()) {
      return res.status(403).json({ error: 'Invalid status transition or role not authorized' });
    }

    order.status = newStatus;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
