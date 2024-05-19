import { Server } from "http";
import getLogger from "../config/logger";
import { Config } from "../config/config";
const logger = getLogger(Config.getLogLevel());
import createApp from "./app";
import { Database } from "../core/database";

export const startServer = async (port: number | string): Promise<Server> => {
  const app = createApp();
  const database = new Database();
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
