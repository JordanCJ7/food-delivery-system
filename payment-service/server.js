require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Import the database connection function
const mongoose = require('mongoose');

const paymentRoutes = require('./routes/paymentRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

// Connect to MongoDB
connectDB();

// Swagger UI route
app.use('/api/payments/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentRoutes);

// Start the server
const PORT = process.env.PORT || 5004; // Changed port to 5004 for order service
app.listen(PORT, () => {
  console.log(`🚀 paymnt-service running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/payments/docs/`);
});