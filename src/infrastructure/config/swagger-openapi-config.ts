import swaggerJsdoc from "swagger-jsdoc";
import { Config } from "./config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DailyTrends API",
    version: "1.0.0",
    description: "API to manage news feeds effectively"
  },
  servers: [
    {
      url: `http://localhost:${Config.getPort()}`,
      description: "Local Development Server"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./dist/domain/**/*.js", "./dist/infrastructure/routes/**/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
