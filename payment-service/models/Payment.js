const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'completed', 'failed'], default: 'created' },
  provider: { type: String, enum: ['paypal', 'payhere'], required: true },
  providerPaymentId: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
