const express = require('express');
const router = express.Router();
const { createPayment, verifyPayment, checkPayment } = require('../controllers/paymentController'); // Import checkPayment controller
const auth = require('../middleware/authMiddleware');

router.post('/create-payment', auth, createPayment);
router.post('/verify-payment', auth, verifyPayment);
router.post('/check-payment', auth, checkPayment); // Add route for checking payment status

module.exports = router;
