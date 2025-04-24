require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
