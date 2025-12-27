import config from "../../../config";
import prisma from "../../../prisma/client";
import { CustomError } from "../../../utils/customError";
import { encrypt, generateSecureRandomString } from "../../../utils/helpers";
import { VercelProviderAdapter } from "../../adapters/vercel.provider.adapter";
import type { ConnectProviderCallbackDto } from "../../providers.dto";
import type { ProvidersServiceStrategy } from "../strategy.provider.interface";

const { REDIRECT_URI_VERCEL, FRONTEND_URL } = config;

export class VercelServiceStrategy implements ProvidersServiceStrategy {
  constructor(private readonly adapter = new VercelProviderAdapter()) {}

  async connect(data: { id: string }) {
    const state = generateSecureRandomString(43);

    // store oauth state in db
    await prisma.oAuthState.create({
      data: {
        expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        state,
        provider: "vercel",
        user_id: data.id,
      },
    });

    const installUrl = this.adapter.getInstallUrl({
      state,
      redirect_uri: REDIRECT_URI_VERCEL as string,
    });

    console.log(installUrl);

    return {
      installUrl,
      // state,
    };
  }

  async connectionCallback(data: ConnectProviderCallbackDto) {
    // get oauth state from db
    const oauthState = await prisma.oAuthState.findUnique({
      where: {
        state: data.state,
        provider: data.provider,
      },
    });

    if (!oauthState || new Date(oauthState.expires_at) < new Date()) {
      throw new CustomError("Invalid or expired OAuth state", 400);
    }

    const tokenData = await this.adapter.exchangeCodeForToken(data.code);

    // validate nonce
    await prisma.deploymentProviderIntegration.create({
      data: {
        provider: "vercel",
        accessToken: encrypt(tokenData.access_token),
        provider_user_id: tokenData.user_id,
        team_id: tokenData.team_id || null,
        user_id: oauthState.user_id,
      },
    });

    const responseUrl = `${FRONTEND_URL}/settings/integrations`;
    return responseUrl;
  }
}
