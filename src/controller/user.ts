import type { NextFunction, Request, Response } from "express";
import { genralResponse } from "../helper/generalFunction";
import { selectByValues, selectTable } from "../helper/DbHelpers/DbQueryHelper";
import Messages from "../helper/textHelpers/messages";
import RedisMessages from "../helper/textHelpers/redisHelper";
import DB from "../helper/textHelpers/Db_helper";
import type { UserTableType } from "../types/dbTypes";
import {
  getObjectArrayCache,
  getObjectCache,
  setObjectArrayCache,
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

const userList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    redisData = await getObjectArrayCache(RedisMessages.See_User_List);
    result = !!redisData.length ? redisData : await selectTable(DB.User_Table);
    !redisData.length &&
      setObjectArrayCache(
        RedisMessages.See_User_List,
        RedisMessages.See_User_Hash,
        result as UserTableType[]
      );
    genralResponse(res, 200, { message: Messages.All_Users, result });
  } catch (e) {
    next(e);
  }
};

const userById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    redisData = await getObjectCache(`${RedisMessages.See_User_Hash}${id}`);
    result = !!redisData
      ? redisData
      : ((await selectByValues(DB.User_Table, [["id", id]])) as UserTableType);
    !redisData &&
      setObjectCache(
        RedisMessages.See_User_List,
        `${RedisMessages.See_User_Hash}${id}`,
        result as UserTableType
      );
    genralResponse(res, 200, { message: Messages.User_Get, result });
  } catch (e) {
    next(e);
  }
};

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
      let data = (await selectByValues(DB.User_Table, [
        ["id", id],
      ])) as UserTableType;
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

export { userList, userById, updateUser, deleteUser };
