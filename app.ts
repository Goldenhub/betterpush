import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import { errorHandler, unknownEndpoints } from "./src/middlewares";
import router from "./src/routes";
import "reflect-metadata";

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// app.set("trust proxy", true);

app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api/v1");
});
app.get("/api/v1", (_req: Request, res: Response) => {
  res.json({ msg: `welcome to BetterPush API` });
});

app.use("/api/v1", router);
app.use(unknownEndpoints);
app.use(errorHandler);

export default app;
