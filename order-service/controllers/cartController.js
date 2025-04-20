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

exports.decreaseCartItemQuantity = async (req, res) => {
  const { menuItemId } = req.body;
  const customerId = req.user.id;

  if (!menuItemId) {
    return res.status(400).json({ error: 'menuItemId is required' });
  }

  try {
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.menuItemId.toString() === menuItemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // Remove item if quantity is 1
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Quantity updated successfully',
      item: item.quantity > 0
        ? { menuItemId: item.menuItemId, quantity: item.quantity }
        : null
    });

  } catch (err) {
    console.error('Error decreasing cart item quantity:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { menuItemId } = req.body;
  const customerId = req.user.id;

  try {
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.menuItemId.toString() === menuItemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
