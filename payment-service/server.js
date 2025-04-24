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

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
