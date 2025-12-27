// import config from "../../config";
import axios from "axios";
import config from "../../config";
import { CustomError } from "../../utils/customError";
import type { VercelTokenData } from "../providers.interface";

const { REDIRECT_URI_VERCEL, CLIENT_ID_VERCEL, CLIENT_SECRET_VERCEL } = config;

export class VercelProviderAdapter {
  getInstallUrl(data: { state: string; redirect_uri: string }) {
    const params = new URLSearchParams({
      state: data.state,
      redirect_uri: data.redirect_uri,
    });

    return `https://vercel.com/integrations/betterpush/new?${params}`;
  }

  async exchangeCodeForToken(code: string): Promise<VercelTokenData> {
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
}
