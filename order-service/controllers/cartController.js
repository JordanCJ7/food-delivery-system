const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const customerId = req.user.id;

  try {
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({ customerId, items: [] });
    }

    const existingItem = cart.items.find(item => item.menuItemId.toString() === menuItemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.id }).populate('items.menuItemId');
    res.status(200).json(cart || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
