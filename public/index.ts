/// <reference path="../src/types/express.d.ts" />

import app from "../app";
import config from "../src/config";
import { runQueue } from "../src/config/queue";

const { PORT } = config;

app.listen(PORT, () => {
  console.info(`App 🚀running on Port http://localhost:${PORT}`);
  runQueue();
});
