import express from "express";
import { validate } from "../middlewares";
import { webhook } from "./deployment.controller";

const webhookRouter = express.Router();

webhookRouter.post("/:provider", validate.providerWebhook, webhook);

export default webhookRouter;
