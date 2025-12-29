import express from "express";
import { authenticate, validate } from "../middlewares";
import { createProject, deploy, getProjects, getTeams, streamDeployment } from "./deployment.controller";

const deploymentRouter = express.Router();

deploymentRouter.post("/deploy", authenticate, validate.deploy, deploy);
deploymentRouter.post("/projects", authenticate, validate.createProject, createProject);
deploymentRouter.get("/projects", authenticate, validate.getProjects, getProjects);
deploymentRouter.get("/teams", authenticate, validate.getTeams, getTeams);
deploymentRouter.get("/:id/stream", authenticate, validate.streamDeployment, streamDeployment);

export default deploymentRouter;
