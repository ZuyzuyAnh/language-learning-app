const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Get the current environment
const environment = process.env.NODE_ENV || "development";

// Determine the server URL based on environment
const serverUrl =
  environment === "production"
    ? process.env.RENDER_EXTERNAL_URL || "https://your-app-name.onrender.com"
    : "http://localhost:5000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Language Learning API",
      version: "1.0.0",
      description: "API documentation for the Language Learning application",
      contact: {
        name: "API Support",
        email: "support@languagelearning.com",
      },
    },
    servers: [
      {
        url: serverUrl,
        description:
          environment === "production"
            ? "Production server"
            : "Development server",
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
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { explorer: true }),
  specs,
};
