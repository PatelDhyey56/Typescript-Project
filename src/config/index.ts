import * as dotenv from "dotenv";
dotenv.config();
export const SERVER = {
  PORT: process.env.PORT,
  PASSKEY: process.env.PASSKEY || "123456789",
};
export const DB_CONFIG = {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: +(process.env.DB_PORT || 5432),
  DB_DATABASE: process.env.DB_DATABASE,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_SCHEMA: process.env.DB_SCHEMA,
};
export const REDIS = {
  REDIS_TTL: +(process.env.REDIS_TTL || 3660),
};
