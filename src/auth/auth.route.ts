import express from "express";
import { authenticate, validate } from "../middlewares";
import { forgotPassword, login, logout, refreshToken, resetPassword, signup, verifyEmailOnSignup } from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/signup", validate.signup, signup);
authRouter.post("/verify-email", validate.verifyEmailOnSignup, verifyEmailOnSignup);
authRouter.post("/login", validate.login, login);
authRouter.post("/forgot-password", validate.forgotPassword, forgotPassword);
authRouter.post("/reset-password", validate.resetPassword, resetPassword);
authRouter.post("/refresh", authenticate, validate.refreshToken, refreshToken);
authRouter.post("/logout", authenticate, validate.logout, logout);

export default authRouter;
