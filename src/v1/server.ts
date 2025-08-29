import app from "./app";
import Server from "http";
import logger from "./utils/logger";

const PORT = process.env.PORT;

const server = Server.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
  logger.info(`Send requests to http://localhost:${PORT}/api/ldai-health/v1`);
  logger.info(`Press CTRL + C to stop server.`);
});
