require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Import the database connection function
const mongoose = require('mongoose');

const orderRoutes = require('./routes/orderRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(express.json());

app.use('/api/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5002, () => console.log('Order service running on port', process.env.PORT));
  })
  .catch(err => console.error(err));
