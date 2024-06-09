import { Server } from "http";
import getLogger from "../config/logger";
import { Config } from "../config/config";
import createApp from "./app";
import { Database } from "../core/database";
const logger = getLogger(Config.getLogLevel());


export const startServer = async (port: number | string): Promise<Server> => {
  const app = createApp();
  const database = new Database();
  await database.connect();
  return new Promise<Server>((resolve, reject) => {
  
    const server = app.listen(port, () => {
      logger.info(`Server is running on port ${port} and database is connected`);
      resolve(server);
    });

    server.on("error", (serverError) => {
      logger.error("Failed to start server:", serverError);
      reject(serverError);
    });
  });
};