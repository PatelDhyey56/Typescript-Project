import * as dotenv from "dotenv";
dotenv.config();
const {
  PORT,
  DB_USER,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_SCHEMA,
  DB_PASSWORD,
  PASSKEY,
  REDIS_TTL,
  REDIS_DATA_ENTRY_TIME,
} = process.env;
export {
  PORT,
  DB_USER,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_PASSWORD,
  DB_SCHEMA,
  PASSKEY,
  REDIS_TTL,
  REDIS_DATA_ENTRY_TIME,
};
