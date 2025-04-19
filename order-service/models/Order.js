const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      quantity: Number
    }
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: [
      'Pending',        // Order placed
      'Confirmed',      // Confirmed by restaurant
      'Preparing',      // Restaurant is preparing food
      'Completed',      // Food is ready
      'Accepted',       // Delivery agent accepted the job
      'dispatched', // Restaurant hands over to delivery agent
      'Delivered',      // Order delivered to customer
      'Cancelled'       // Cancelled by restaurant or delivery agent
    ],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
// This code defines a Mongoose schema for an Order model in a Node.js application. 
// The schema includes fields for customer ID, restaurant ID, items (with menu item IDs and quantities), total price, and order status. 
// The status field has a default value of 'Pending' and can take on several predefined values. 
// The schema also includes timestamps for when the order was created and last updated. 
// Finally, the schema is exported as a Mongoose model named 'Order'.