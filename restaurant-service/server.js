require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); 
const restaurantRoutes = require('./routes/restaurantRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger'); // Import Swagger setup

const app = express();

// Connect to MongoDB
connectDB();

// Swagger UI route
app.use('/api/restaurants/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Changed docs path to /api/restaurants/docs

// Middleware
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantRoutes); // Routes are prefixed with /api/restaurants

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 restaurant-service running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/restaurants/docs/`); // Updated to reflect the /api/restaurants/docs path
});
