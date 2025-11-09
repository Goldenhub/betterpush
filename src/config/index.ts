import dotenv from "dotenv";

const isDevelopment = process.env.ENV && process.env.ENV === "development";
console.log(isDevelopment);

if (isDevelopment) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

const config = {
  PORT: process.env.PORT || 4321,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
  PG_BOSS_DATABASE_URL: process.env.PG_BOSS_DATABASE_URL,
  GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default config;
