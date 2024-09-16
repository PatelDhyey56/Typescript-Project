import type { NextFunction, Request, Response } from "express";
import type { QueryResultRow } from "pg";
import {
  getObjectArrayCache,
  getObjectCache,
} from "../helper/DbHelpers/redis/userRedis";
import { selectByValues, selectTable } from "../helper/DbHelpers/DbQueryHelper";
import { genralResponse } from "../helper/generalFunction";
let redisData, result;

const redisGetListOfData =
  (
    tableName: string,
    redisListName: string,
    redisHashName: string,
    redisSetFunction: Function,
    message: string
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      redisData = await getObjectArrayCache(redisListName);
      result = !!redisData.length ? redisData : await selectTable(tableName);
      !redisData.length &&
        redisSetFunction(redisListName, redisHashName, result);
      genralResponse(res, 200, { message, result });
    } catch (e) {
      next(e);
    }
  };

const redisGetDataById =
  (
    tableName: string,
    redisListName: string,
    redisHashName: string,
    redisSetFunction: Function,
    message: string
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
      redisData = await getObjectCache(`${redisHashName}${id}`);
      result = !!redisData
        ? redisData
        : ((await selectByValues(tableName, [["id", id]])) as QueryResultRow);
      !redisData &&
        redisSetFunction(
          redisListName,
          `${redisHashName}${id}`,
          result as QueryResultRow
        );
      genralResponse(res, 200, { message, result });
    } catch (e) {
      next(e);
    }
  };

export { redisGetListOfData, redisGetDataById };
