const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple API documentation using Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Your local server
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // You can specify the type of token, in this case JWT
        },
      },
    },
    security: [
      {
        BearerAuth: [], // This will apply BearerAuth security to all endpoints
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
