// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Management System APIS",
      version: "1.0.0",
      description: "Digital LMS API's with Swagger documentation",
    },
    components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "token",
            description: "JWT auth token stored in cookie",
          },
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);
export { swaggerUi, specs };
