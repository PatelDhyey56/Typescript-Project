import { REDIS } from "../../../config";
import type { UserTableType } from "../../../types/dbTypes";
import type { RedisObject } from "../../../types/redis";
import { redis } from "./redis";

export let userData: RedisObject[] | RedisObject;
async function setObjectArrayCache(
  listName: string,
  objectName: string,
  data: UserTableType[],
  ttl: number = REDIS.REDIS_TTL
): Promise<boolean> {
  try {
    data.map(async (e: UserTableType): Promise<void> => {
      let obj: RedisObject = objectToString(e);
      await redis
        .multi()
        .hSet(`${objectName}${obj.id}`, Object.entries(obj))
        .lPush(listName, `${objectName}${obj.id}`)
        .expire(`${objectName}${obj.id}`, ttl)
        .exec();
    });
    await redis.expire(listName, ttl);
    return true;
  } catch (err) {
    return false;
  }
}

async function getObjectArrayCache(ListName: string): Promise<RedisObject[]> {
  try {
    const keys: string[] = await redis.lRange(ListName, 0, -1);
    userData = await Promise.all(
      keys
        .reverse()
        .map(async (k: string): Promise<RedisObject> => await redis.hGetAll(k))
    );
    return userData;
  } catch (err) {
    return [];
  }
}
async function setObjectCache(
  listName: string,
  objectName: string,
  data: UserTableType,
  ttl: number = REDIS.REDIS_TTL
): Promise<boolean> {
  try {
    let obj = objectToString(data);
    await redis
      .multi()
      .hSet(objectName, obj)
      .lPush(listName, objectName)
      .expire(objectName, ttl)
      .expire(listName, ttl)
      .exec();
    return true;
  } catch (err) {
    return false;
  }
}
async function getObjectCache(key: string): Promise<boolean | RedisObject> {
  try {
    userData = await redis.hGetAll(key);
    console.log(userData);
    return !!Object.keys(userData).length ? userData : false;
  } catch (err) {
    return false;
  }
}

async function removeCache(
  key: string,
  object: boolean = false,
  listName: string = ""
): Promise<boolean> {
  try {
    object
      ? await redis.multi().del(key).lRem(listName, -1, key).exec()
      : await redis.del(key);
    return true;
  } catch (err) {
    return false;
  }
}

const objectToString = (e: Object): RedisObject => {
  let obj: { [key: string]: string } = {};
  Object.keys(e).forEach((key) => {
    obj[key] = String(e[key as keyof typeof e]) ?? "null";
  });
  return obj;
};
export {
  setObjectArrayCache,
  getObjectArrayCache,
  setObjectCache,
  getObjectCache,
  removeCache,
};
