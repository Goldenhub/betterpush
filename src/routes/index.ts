import express from "express";
import authRouter from "../auth/auth.route";
import userRouter from "../user/user.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
