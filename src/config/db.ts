import postgresql, { type QueryResultRow } from "pg";
import { DB_CONFIG } from "./index";
const { Pool } = postgresql;

const db = new Pool({
  user: DB_CONFIG.DB_USER,
  host: DB_CONFIG.DB_HOST,
  port: DB_CONFIG.DB_PORT,
  database: DB_CONFIG.DB_DATABASE,
  password: DB_CONFIG.DB_PASSWORD,
});

db.connect(function (err: Error | undefined): void {
  if (err) throw err;
  console.log("Db Connected :)");
});

const queryRun = (
  sql: string,
  values: string[] = []
): Promise<QueryResultRow[] | string> => {
  return new Promise((resolve, reject) => {
    console.log(sql);
    db.query(sql, values, (err: Error, result: any) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
  });
};

export { db, queryRun };
