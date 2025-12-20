import pgBoss from "pg-boss";
import config from "./index";

const { PG_BOSS_DATABASE_URL } = config;

export const boss = new pgBoss(PG_BOSS_DATABASE_URL as string);

export const runQueue = async () => {
  boss.on("error", console.error);
  await boss.start();
  console.log("Job queue started");
};
