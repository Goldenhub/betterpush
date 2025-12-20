import { boss } from "../config/queue";
import { mailWorker } from "./email.worker";

export const enqueueMail = async (data: Record<string, string>, html: string) => {
  const queue = "email-queue";
  await boss.createQueue(queue, {
    retryLimit: 3,
    retryBackoff: true,
    deleteAfterSeconds: 10,
  });
  const id = await boss.send({
    name: queue,
    data: {
      ...data,
      html,
    },
  });

  console.log(`Queued Mail Job with ID: ${id}`);

  await mailWorker(queue);
};
