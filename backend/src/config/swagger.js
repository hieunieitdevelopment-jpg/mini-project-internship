const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin Map API",
      version: "1.0.0",
      description:
        "API tra cứu đơn vị hành chính Việt Nam và mapping thay đổi địa giới",
    },
    servers: [
      {
        url: "/api/v1",
        description: "API v1",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
