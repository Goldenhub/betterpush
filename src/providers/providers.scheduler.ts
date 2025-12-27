import { boss } from "../config/queue";
import { connectProviderWorker } from "./providers.worker";

export const scheduleProviderOauthStateCleanup = async () => {
  const scheduleName = "cleanup-oauth-state";
  await boss.createQueue(scheduleName);
  const CRON = "0 6 * * *";
  await boss.schedule(scheduleName, CRON, {}, { tz: "Africa/Lagos" });

  await connectProviderWorker(scheduleName);

  console.log("Providers OAuth State Cleanup scheduled");
};
