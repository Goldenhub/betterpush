import { boss } from "../config/queue";
import prisma from "../prisma/client";

export const connectProviderWorker = async (queue: string) => {
  await boss.work(queue, async () => {
    await prisma.oAuthState.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });
  });
};
