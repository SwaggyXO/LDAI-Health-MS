import express, { NextFunction, Response } from "express";
import swaggerUi from "swagger-ui-express";
import OpenAPIDoc from "./health-ms-open-api-spec.json";
import { InvalidEndpointException } from "./exception/api.exception";
import { cpuUsage, memUsage, upTime } from "./utils/prometheus";
import HealthRouter from "./route/health.router";

const router = express.Router();

// Health check & metrics
router.get("/health-check", async (_, res: Response) => {
  res.status(200).json({
    message: "LDAI-Health-MS up and running!",
    metrics: {
      uptime: `${(await upTime.get()).values[0].value}s`,
      memoryUsage: `${(await memUsage.get()).values[0].value} bytes`,
      cpuUsage: `${(await cpuUsage.get()).values[0].value}s`,
    },
  });
});

// Base route
router.get("/", (_, res: Response) => {
  res.status(200).json({
    message: "Welcome to LDAI-Health-MS!",
  });
});

// router.use('/docs', swaggerUi.serve, swaggerUi.setup(OpenAPIDoc));
router.use("/health", HealthRouter);

router.all("*", (_, res: Response, next: NextFunction) => {
  const error = new InvalidEndpointException(
    "Not found",
    "Accessing an invalid endpoint!"
  );
  next(error);
});

export default router;
