import { Config } from "./infrastructure/config/config";
import getLogger from "./infrastructure/config/logger";
import { startServer } from "./infrastructure/server/server";
const logger = getLogger(Config.getLogLevel());
const port = Config.getPort();

startServer(port).then(() => {
    console.info(`Server running on port ${port}`)
    logger.info(`Server running on port ${port}`)
}).catch((error) => {
    logger.error('Error starting server:', error);
    process.exit(1);
})


