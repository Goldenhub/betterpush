import axios from "axios";
import config from "../../../config";
import prisma from "../../../prisma/client";
import { CustomError } from "../../../utils/customError";
import { encrypt, generateSecureRandomString } from "../../../utils/helpers";
import { VercelProviderAdapter } from "../../adapters/vercel.provider.adapter";
import type { ConnectProviderCallbackDto } from "../../providers.dto";
import type { VercelTokenData } from "../../providers.interface";
import type { ProvidersServiceStrategy } from "../strategy.provider.interface";

const { REDIRECT_URI_VERCEL, FRONTEND_URL, CLIENT_ID_VERCEL, CLIENT_SECRET_VERCEL } = config;

export class VercelServiceStrategy implements ProvidersServiceStrategy {
  constructor(private readonly adapter = new VercelProviderAdapter()) {}

  async connect(data: { user_id: string }) {
    const state = generateSecureRandomString(43);

    const params = new URLSearchParams({
      state,
      redirect_uri: REDIRECT_URI_VERCEL as string,
    });

    // store oauth state in db
    await prisma.oAuthState.create({
      data: {
        expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        state,
        provider: "vercel",
        user_id: data.user_id,
      },
    });

    // const redirect = `https://vercel.com/oauth/authorize?${params}`;
    const redirect = `https://vercel.com/integrations/betterpush/new?${params}`;

    return {
      redirect,
      state,
    };
  }

  async connectionCallback(data: ConnectProviderCallbackDto) {
    const payload = this.adapter.connectionCallbackPayload(data);

    const tokenData = await exchangeCodeForToken(payload.code);

    console.log("token data:", tokenData);

    // get oauth state from db
    const oauthState = await prisma.oAuthState.findUnique({
      where: {
        state: payload.state,
        provider: payload.provider,
      },
    });

    if (!oauthState || new Date(oauthState.expires_at) < new Date()) {
      throw new CustomError("Invalid or expired OAuth state", 400);
    }

    // validate nonce
    await prisma.deploymentProviderIntegration.create({
      data: {
        accessToken: encrypt(tokenData.access_token),
        provider: payload.provider,
        provider_user_id: tokenData.user_id,
        team_id: tokenData.team_id || null,
        user_id: oauthState.user_id,
      },
    });

    const responseUrl = `${FRONTEND_URL}/settings/integrations`;
    return responseUrl;
  }
}

async function exchangeCodeForToken(code: string): Promise<VercelTokenData> {
  const response = await axios.post(
    "https://api.vercel.com/oauth/access_token",
    new URLSearchParams({
      client_id: CLIENT_ID_VERCEL as string,
      client_secret: CLIENT_SECRET_VERCEL as string,
      code: code as string,
      redirect_uri: REDIRECT_URI_VERCEL as string,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     throw new Error(`Failed to exchange code for token: ${JSON.stringify(errorData)}`);
  //   }

  //   return await response.json();
  if (response.status !== 200) {
    throw new CustomError(`Failed to exchange code for token: ${response.data.error}`, 400);
  }
  return response.data as VercelTokenData;
}
