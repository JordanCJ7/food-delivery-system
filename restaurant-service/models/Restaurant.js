const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  phone: { type: String },
  isOpen: { type: Boolean, default: true },
  verified: { type: Boolean, default: false } // Admin verifies
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
