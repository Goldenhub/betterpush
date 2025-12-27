// import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import type { ConnectProviderCallbackDto, ConnectProviderDto } from "../../providers.dto";
import { ProvidersService } from "../../providers.service";
import type { ProvidersControllerStrategy } from "../strategy.provider.interface";

export class VercelProviderControllerStrategy implements ProvidersControllerStrategy {
  constructor(private readonly providerService = new ProvidersService()) {}

  async connect(req: Request, res: Response, _next: NextFunction) {
    const { provider } = req.params as unknown as ConnectProviderDto;
    const { id } = req.user;

    const response = await this.providerService.connect({ provider, id });

    // redirect to provider oauth url
    return res.redirect(response.installUrl as string);
  }

  async connectionCallback(req: Request, res: Response, _next: NextFunction) {
    const { code, state } = req.query as unknown as Omit<ConnectProviderCallbackDto, "provider">;
    const { provider } = req.params as Pick<ConnectProviderCallbackDto, "provider">;

    // call the provider service connection callback
    const response = await this.providerService.connectionCallback({
      code,
      state,
      provider,
    });

    // redirect to frontend integration settings page
    return res.redirect(response);
  }
}
