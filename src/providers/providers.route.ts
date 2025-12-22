import express from "express";
import { authenticate, validate } from "../middlewares";
import { connect, connectionCallback } from "./providers.controller";

const providerIntegrationRouter = express.Router();

providerIntegrationRouter.get("/:provider/connect", authenticate, validate.connectProvider, connect);
providerIntegrationRouter.get("/:provider/callback", validate.connectProviderCallback, connectionCallback);

export default providerIntegrationRouter;
