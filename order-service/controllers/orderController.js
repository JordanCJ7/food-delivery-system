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
