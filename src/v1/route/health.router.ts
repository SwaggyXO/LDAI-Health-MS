import express from "express";
import { baseHealthHandler, healthReportHandler, oAuth2Handler, startReportEmailer, stopReportEmailer } from "../controller/health.controller";

const HealthRouter = express.Router();

HealthRouter.get("/", baseHealthHandler);
HealthRouter.get('/report', healthReportHandler);
HealthRouter.get('/oauth2callback', oAuth2Handler);
HealthRouter.post('/emailer/start', startReportEmailer);
HealthRouter.post('/emailer/stop', stopReportEmailer);

export default HealthRouter;
