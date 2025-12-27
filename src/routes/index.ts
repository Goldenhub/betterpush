import express from "express";
import authRouter from "../auth/auth.route";
import deploymentRouter from "../deployment/deployment.route";
import webhookRouter from "../deployment/webhook.route";
import providerIntegrationRouter from "../providers/providers.route";
import repoRouter from "../repo/repo.route";
import userRouter from "../user/user.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/repositories", repoRouter);
router.use("/deployments", deploymentRouter);
router.use("/integrations", providerIntegrationRouter);
router.use("/webhook", webhookRouter);

export default router;
