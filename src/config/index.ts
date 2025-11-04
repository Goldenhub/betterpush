import dotenv from "dotenv";

const isDevelopment = (process.env.ENV && process.env.ENV) === "development";
console.log(isDevelopment);

if (isDevelopment) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

export const config = {
  PORT: process.env.PORT || 4321,
};
