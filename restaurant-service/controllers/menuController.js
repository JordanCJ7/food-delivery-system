const MenuItem = require("../models/MenuItem");

// Add a menu item to a restaurant
exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const restaurantId = req.params.id;

    const newItem = await MenuItem.create({
      restaurantId,
      name,
      description,
      price,
      imageUrl
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get menu items for a restaurant
exports.getMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.id });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.menuId,
      req.body,
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ message: 'Menu item not found' });

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle availability of a menu item
exports.toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.menuId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    // Toggle the availability status
    menuItem.available = !menuItem.available;
    await menuItem.save();

    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.menuId);
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
