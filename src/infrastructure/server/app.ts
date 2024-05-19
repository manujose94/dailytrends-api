// src/infrastructure/server/app.ts

import express from "express";
import swaggerUi from "swagger-ui-express";
import routes from "../routes";
import { morganMiddleware } from "../middleware/morgan-middleware";
import rateLimiterMiddleware from "../middleware/rate-limit-middleware";
import { swaggerSpec } from "../config/swagger-openapi-config";
import getLogger from "../config/logger";
import { Config } from "../config/config";

const logger = getLogger(Config.getLogLevel());

const createApp = () => {
  const app = express();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(express.json());
  app.use(rateLimiterMiddleware);
  app.use(morganMiddleware);

  app.use("/api/v1", routes);

  app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
  });

  return app;
};

export default createApp;
