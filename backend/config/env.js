import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const env = {
  MONGO_URL: process.env.MONGO_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
};
