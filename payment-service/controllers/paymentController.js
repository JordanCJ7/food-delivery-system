const { PayPalClient, PayPalOrders } = require('../utils/paypalClient');

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
    const { orderId } = req.body;

    const request = new PayPalOrders.CaptureOrderRequest(orderId);
    request.requestBody({});

    const response = await PayPalClient().execute(request);
    if (response.result.status === 'COMPLETED') {
      // Optionally update order status in DB
      return res.status(200).json({ success: true, data: response.result });
    }

    res.status(400).json({ success: false, message: 'Payment not completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
