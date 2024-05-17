import express from "express";
import swaggerUi from "swagger-ui-express";

import routes from "../routes";
import { morganMiddleware } from "../middleware/morgan-middleware";
import { Database } from "../core/database";
import rateLimiterMiddleware from "../middleware/rate-limit-middleware";
import { swaggerSpec } from "../config/swagger-openapi-config";

export const startServer = async (port: number | string) => {
  const app = express();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  const database = new Database();

  app.use(express.json());

  app.use(rateLimiterMiddleware);
  app.use(morganMiddleware);
  app.use("/api/v1", routes);

  app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
  });

  await new Promise((resolve) =>
    app.listen(port, async () => {
      await database.connect();

      resolve(app);
    })
  );
};
