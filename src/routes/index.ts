import express from "express";
import authRouter from "../auth/auth.route";
import repoRouter from "../repo/repo.route";
import userRouter from "../user/user.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/repositories", repoRouter);

export default router;
