import type { NextFunction, Request, Response } from "express";
import type { ConnectProviderCallbackDto, ConnectProviderDto } from "../providers.dto";

export interface ProvidersServiceStrategy {
  connect: (data: ConnectProviderDto & { user_id: string }) => Promise<Record<string, unknown>>;
  connectionCallback?: (data: ConnectProviderCallbackDto) => Promise<string>;
}

export interface ProvidersControllerStrategy {
  connect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  connectionCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
