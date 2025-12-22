import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";
import type { ProvidersControllerStrategy } from "./strategies/strategy.provider.interface";
import { VercelControllerStrategy } from "./strategies/vercel.controller.strategy";

class ProvidersController {
  private strategies: Record<string, ProvidersControllerStrategy> = {
    vercel: new VercelControllerStrategy(),
  };

  connect = handleTryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const strategy = this.strategies[req.params.provider as string];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${req.params.provider}`, 400);
    }
    return strategy.connect(req, res, next);
  });

  connectionCallback = handleTryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const strategy = this.strategies[req.params.provider as string];
    if (!strategy || !strategy.connectionCallback) {
      throw new CustomError(`No strategy found for provider: ${req.params.provider}`, 400);
    }
    return await strategy.connectionCallback(req, res, next);
  });
}

export const { connect, connectionCallback } = new ProvidersController();
