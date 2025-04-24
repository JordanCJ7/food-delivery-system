const express = require('express');
const router = express.Router();
const { createPayment, verifyPayment } = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

router.post('/create-payment', auth, createPayment);
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;
