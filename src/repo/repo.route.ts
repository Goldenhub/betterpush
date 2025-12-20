import express from "express";
import { authenticate, validate } from "../middlewares";
import { getRepos } from "./repo.controller";

const repoRouter = express.Router();

repoRouter.get("/", authenticate, getRepos);

export default repoRouter;
