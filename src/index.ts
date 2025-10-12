import { Config } from "./infrastructure/config/config";
import getLogger from "./infrastructure/config/logger";
import { startServer } from "./infrastructure/server/server";
import { Server } from "http";
import { gracefulShutdown } from "./infrastructure/server/shutdown";
const logger = getLogger(Config.getLogLevel());
const port = Config.getPort();

let server: Server;

startServer(port)
  .then((srv) => {
    server = srv;
    logger.info(`Server running on port ${port}`);
  })
  .catch((error) => {
    logger.error("Error starting server:", error);
    process.exit(1);
  });

// Signal Handlers
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  gracefulShutdown(server);
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  gracefulShutdown(server);
});

