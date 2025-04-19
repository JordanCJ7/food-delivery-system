const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
// This code defines a Mongoose schema for a Cart model in a Node.js application.
// The schema includes fields for customer ID and items (with menu item IDs and quantities). 
// The quantity field is required and must be at least 1. 
// The schema also includes timestamps for when the cart was created and last updated. 
// Finally, the schema is exported as a Mongoose model named 'Cart'. 