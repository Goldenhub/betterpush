import axios from "axios";
import prisma from "../prisma/client";
import { CustomError } from "../utils/customError";
import { decrypt } from "../utils/helpers";

export const repoService = {
  async getRepos(user_id: string) {
    //Get repositories
    const credential = await prisma.gitCredential.findFirst({
      where: {
        provider: "github",
        user_id,
      },
      select: {
        accessToken: true,
      },
    });

    if (!credential) {
      throw new CustomError("No git credentials found", 400);
    }

    const decryptedAccessToken = decrypt(credential.accessToken as string);

    const repos = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${decryptedAccessToken}` },
    });

    return {
      repos: repos.data,
      link: repos.headers.link,
    };
  },
};
