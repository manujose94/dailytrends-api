import express from "express";
import swaggerUi from "swagger-ui-express";
import { Server } from "http";
import routes from "../routes";
import { morganMiddleware } from "../middleware/morgan-middleware";
import { Database } from "../core/database";
import rateLimiterMiddleware from "../middleware/rate-limit-middleware";
import { swaggerSpec } from "../config/swagger-openapi-config";
import getLogger from "../config/logger";
import { Config } from "../config/config";
const logger = getLogger(Config.getLogLevel());

export const startServer = async (port: number | string): Promise<Server> => {
  const app = express();
  const database = new Database();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(express.json());
  app.use(rateLimiterMiddleware);
  app.use(morganMiddleware);

  app.use("/api/v1", routes);

  app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
  });

  return await new Promise<Server>((resolve, reject) => {
    const server = app.listen(port, async () => {
      try {
        await database.connect();
        logger.info(
          `Server is running on port ${port} and database is connected`
        );
        resolve(server);
      } catch (dbError) {
        server.close(() => reject(dbError));
      }
    });
    server.on("error", (serverError) => {
      logger.error("Failed to start server:", serverError);
      reject(serverError);
    });
  });
};
