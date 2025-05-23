const { PayPalClient, PayPalOrders } = require('../utils/paypalClient');
const Payment = require('../models/Payment'); // Import Payment model

exports.createPayment = async (req, res) => {
  try {
    const request = new PayPalOrders.CreateOrderRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: req.body.amount.toFixed(2)
        }
      }]
    });

    const response = await PayPalClient().execute(request);
    res.status(201).json({ id: response.result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, customerId, amount } = req.body; // Include customerId and amount

    const request = new PayPalOrders.CaptureOrderRequest(orderId);
    request.requestBody({});

    const response = await PayPalClient().execute(request);
    if (response.result.status === 'COMPLETED') {
      await Payment.create({
        orderId,
        customerId,
        amount,
        status: 'verified', // Change from 'completed' to 'verified'
        method: 'paypal',
        transactionId: response.result.id
      });
      return res.status(200).json({ success: true, data: response.result });
    }
    res.status(400).json({ success: false, message: 'Payment not completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkPayment = async (req, res) => {
  try {
    const { customerId, amount } = req.body; // Extract customerId and amount from request body
    const payment = await Payment.findOne({ customerId, amount, status: 'verified' });

    if (payment) {
      return res.status(200).json({ success: true, data: payment });
    }

    res.status(404).json({ success: false, message: 'Payment not found or not verified' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
