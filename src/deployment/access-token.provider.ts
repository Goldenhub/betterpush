import prisma from "../prisma/client";
import { CustomError } from "../utils/customError";
import { decrypt } from "../utils/helpers";
import type { ITokenProvider } from "./deployment.interface";

export class AccessTokenProvider implements ITokenProvider {
  async getToken(input: { provider: string; user_id: string }): Promise<string> {
    const record = await prisma.deploymentProviderIntegration.findFirst({
      where: {
        provider: input.provider,
        user_id: input.user_id,
      },
    });

    if (!record) {
      throw new CustomError("Provider not connected", 400);
    }

    return decrypt(record.accessToken);
  }
}
