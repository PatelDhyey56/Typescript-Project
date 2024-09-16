import type { NextFunction, Request, Response } from "express";
import { genralResponse } from "../helper/generalFunction";
import { selectByValues } from "../helper/DbHelpers/DbQueryHelper";
import Messages from "../helper/textHelpers/messages";
import RedisMessages from "../helper/textHelpers/redisHelper";
import DB from "../helper/textHelpers/Db_helper";
import type { UserTableType } from "../types/dbTypes";
import {
  getObjectCache,
  setObjectCache,
} from "../helper/DbHelpers/redis/userRedis";
import type { RedisObject } from "../types/redis";

let result:
    | UserTableType
    | UserTableType[]
    | RedisObject[]
    | RedisObject
    | Boolean,
  redisData;

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const Body = req.body;
  try {
    redisData = await getObjectCache(
      `${RedisMessages.DB_Update_User_Hash}${id}`
    );
    result = !!redisData
      ? false
      : await setObjectCache(
          RedisMessages.DB_User_List,
          `${RedisMessages.DB_Update_User_Hash}${id}`,
          Body
        );
    genralResponse(res, 200, {
      message: result
        ? Messages.User_Updated
        : "User Update is already in Queue",
    });
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    redisData = await getObjectCache(
      `${RedisMessages.DB_Delete_User_Hash}${id}`
    );
    if (!redisData) {
      const data = await selectByValues(DB.User_Table, [["id", id]]);
      result = await setObjectCache(
        RedisMessages.DB_User_List,
        `${RedisMessages.DB_Delete_User_Hash}${id}`,
        data
      );
    } else {
      result = false;
    }
    genralResponse(res, 200, {
      message: result
        ? Messages.User_Updated
        : "User Delete is already in Queue",
    });
  } catch (e) {
    next(e);
  }
};

export { updateUser, deleteUser };
