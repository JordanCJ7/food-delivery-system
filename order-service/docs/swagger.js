const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Service API",
      version: "1.0.0",
      description: "API documentation for the Restaurant microservice",
    },
    servers: [
      {
        url: "http://localhost:5002", // base URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],  // Security configuration for JWT
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
