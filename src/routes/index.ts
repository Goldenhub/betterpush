import express from "express";
import authRouter from "./auth/auth.route";

const router = express.Router();

router.use("/", authRouter);

export default router;
