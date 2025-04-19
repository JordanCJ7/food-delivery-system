const Restaurant = require("../models/Restaurant");

// Register a new restaurant
exports.registerRestaurant = async (req, res) => {
  console.log("Register route hit");  // Debug log to confirm the route is triggered
  try {
    const { name, location, phone } = req.body;

    const newRestaurant = await Restaurant.create({
      name,
      location,
      phone,
      owner: req.user.id
    });

    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle open/closed status of restaurant
exports.toggleStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Not found' });

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin verifies restaurant
exports.verifyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update restaurant details
exports.updateRestaurant = async (req, res) => {
  try {
    const { name, location, phone } = req.body;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { name, location, phone },
      { new: true }
    );
    if (!updatedRestaurant) return res.status(404).json({ message: 'Not found' });
    res.json(updatedRestaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
