// import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import { VercelProviderAdapter } from "../../adapters/vercel.provider.adapter";
import type { ConnectProviderCallbackDto, ConnectProviderDto } from "../../providers.dto";
import { ProvidersService } from "../../providers.service";
import type { ProvidersControllerStrategy } from "../strategy.provider.interface";

export class VercelControllerStrategy implements ProvidersControllerStrategy {
  constructor(
    private readonly adapter = new VercelProviderAdapter(),
    private readonly providerService = new ProvidersService()
  ) {}

  async connect(req: Request, res: Response, _next: NextFunction) {
    const payload = this.adapter.connectionPayload(req.params as unknown as ConnectProviderDto);

    const response = await this.providerService.connect({ provider: payload.provider, user_id: req.user.id });

    // redirect to provider oauth url
    return res.redirect(response.redirect as string);
  }

  async connectionCallback(req: Request, res: Response, _next: NextFunction) {
    const { code, state } = req.query as unknown as Omit<ConnectProviderCallbackDto, "provider">;
    const { provider } = req.params as Pick<ConnectProviderCallbackDto, "provider">;
    const data = { code, state, provider };

    const payload = this.adapter.connectionCallbackPayload(data);
    console.log("payload:", payload);

    // call the provider service connection callback
    const response = await this.providerService.connectionCallback({
      code: payload.code,
      state: payload.state,
      provider: payload.provider,
    });

    // redirect to frontend integration settings page
    return res.redirect(response);
  }
}
