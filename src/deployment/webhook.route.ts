import express from "express";
import { validate } from "../middlewares";
import { webhook } from "./deployment.controller";

const webhookRouter = express.Router();

webhookRouter.post("/:provider", validate.deploy, webhook);

export default webhookRouter;
