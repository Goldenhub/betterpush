import express from "express";
import { authenticate, validate } from "../middlewares";
import { createProject, deploy, getProjects, getTeams } from "./deployment.controller";

const deploymentRouter = express.Router();

deploymentRouter.post("/deploy", authenticate, validate.deploy, deploy);
deploymentRouter.post("/projects", authenticate, validate.createProject, createProject);
deploymentRouter.get("/projects", authenticate, validate.getProjects, getProjects);
deploymentRouter.get("/teams", authenticate, validate.getTeams, getTeams);

export default deploymentRouter;
