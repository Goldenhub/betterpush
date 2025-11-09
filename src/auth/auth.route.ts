import express from "express";
import { authenticate, validate } from "../middlewares";
import { forgotPassword, githubAuth, githubOAuthLoginCallback, githubOAuthRepoCallback, githubRepo, login, logout, refreshToken, resetPassword, signup, verifyEmailOnSignup } from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/signup", validate.signup, signup);
authRouter.post("/verify-email", validate.verifyEmailOnSignup, verifyEmailOnSignup);
authRouter.post("/login", validate.login, login);
authRouter.post("/forgot-password", validate.forgotPassword, forgotPassword);
authRouter.post("/reset-password", validate.resetPassword, resetPassword);
authRouter.post("/refresh", authenticate, validate.refreshToken, refreshToken);
authRouter.post("/logout", authenticate, validate.logout, logout);

authRouter.get("/github/login", githubAuth);
authRouter.get("/github/repos", githubRepo);
authRouter.get("/github/callback", githubOAuthLoginCallback);
authRouter.get("/github/callback/repos", authenticate, githubOAuthRepoCallback);
// authRouter.get("/github/install/callback", githubInstallCallback);

export default authRouter;
