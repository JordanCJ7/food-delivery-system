require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Import the database connection function
const mongoose = require('mongoose');

const orderRoutes = require('./routes/orderRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

// Connect to MongoDB
connectDB();

// Swagger UI route
app.use('/api/orders/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Changed docs path to /api/orders/docs

// Middleware
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);

// Start the server
const PORT = process.env.PORT || 5002; 
app.listen(PORT, () => {
  console.log(`🚀 restaurant-service running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/orders/docs/`); 
});

