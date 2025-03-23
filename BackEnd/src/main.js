import { logger } from "./application/logging.js";
import { app } from "./application/app.js";
app.listen(3000, () => {
  logger.info("App start");
});
