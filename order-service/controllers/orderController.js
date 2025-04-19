const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const cart = await Cart.findOne({ customerId }).populate('items.menuItemId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const restaurantId = cart.items[0].menuItemId.restaurantId;
    const items = cart.items.map(item => ({
      menuItemId: item.menuItemId._id,
      quantity: item.quantity
    }));

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.menuItemId.price * item.quantity, 0
    );

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
  
      if (order.status !== 'Pending') {
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
      const newStatus = req.body.status;
      const userRole = req.user.role;
  
      const validTransitions = {
        restaurant_admin: {
          Pending: 'Confirmed'
        },
        delivery_agent: {
          Confirmed: 'Out for Delivery',
          'Out for Delivery': 'Delivered'
        },
        admin: {
          Pending: ['Confirmed', 'Cancelled'],
          Confirmed: ['Out for Delivery', 'Cancelled'],
          'Out for Delivery': ['Delivered'],
        }
      };
  
      const isValid = () => {
        if (userRole === 'admin') {
          return validTransitions.admin[currentStatus]?.includes(newStatus);
        }
        return validTransitions[userRole]?.[currentStatus] === newStatus;
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
  
