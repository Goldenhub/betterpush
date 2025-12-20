import express from "express";
import { authenticate, validate } from "../middlewares";
import { getCurrentUser, getUser, updateUser } from "./user.controller";

const userRouter = express.Router();

userRouter.get("/me", authenticate, getCurrentUser);
userRouter.get("/:id", authenticate, validate.getUser, getUser);
userRouter.patch("/me", authenticate, validate.updateUser, updateUser);

export default userRouter;
