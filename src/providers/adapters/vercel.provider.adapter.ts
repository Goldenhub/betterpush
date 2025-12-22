// import config from "../../config";
import type { ConnectProviderCallbackDto, ConnectProviderDto } from "../providers.dto";

// const { CLIENT_ID_VERCEL, CLIENT_SECRET_VERCEL } = config;

export class VercelProviderAdapter {
  connectionPayload(data: ConnectProviderDto) {
    return {
      provider: data.provider,
    };
  }

  connectionCallbackPayload(data: ConnectProviderCallbackDto) {
    return {
      provider: data.provider,
      code: data.code,
      state: data.state,
    };
  }
}
