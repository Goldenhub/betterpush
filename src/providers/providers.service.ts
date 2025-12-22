import { CustomError } from "../utils/customError";
import type { ConnectProviderCallbackDto, ConnectProviderDto } from "./providers.dto";
import type { ProvidersServiceStrategy } from "./strategies/strategy.provider.interface";
import { VercelServiceStrategy } from "./strategies/vercel/vercel.service.strategy";

export class ProvidersService {
  private strategies: Record<string, ProvidersServiceStrategy> = {
    vercel: new VercelServiceStrategy(),
  };

  async connect(data: ConnectProviderDto & { user_id: string }) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${data.provider}`, 400);
    }
    return await strategy.connect(data);
  }

  async connectionCallback(data: ConnectProviderCallbackDto) {
    const strategy = this.strategies[data.provider];

    if (!strategy || !strategy.connectionCallback) {
      throw new CustomError(`No strategy found for provider: ${data.provider}`, 400);
    }
    return await strategy.connectionCallback(data);
  }
}
