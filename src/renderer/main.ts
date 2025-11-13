import { bootstrap } from "@core/bootstrap";
import { logger } from "@core/logger";

bootstrap().catch((error) => {
  logger.error("Bootstrap failure", error);
});
