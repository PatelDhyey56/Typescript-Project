import { createClient } from "redis";
import redisHelper from "../../textHelpers/redisHelper";
import DB from "../../textHelpers/Db_helper";
import { addData, deleteData, updateData } from "../DbQueryHelper";
import { REDIS } from "../../../config";

const redis = createClient();

redis.on("error", (err) => console.log("Redis Client Error", err));

(async (): Promise<void> =>
  await redis.connect().then(() => console.log("Redis Connnected :)")))();

setInterval(async (key: string = redisHelper.DB_User_List) => {
  try {
    let setLen: number = await redis.lLen(key);
    while (setLen > 0) {
      const popData: string = (await redis.lIndex(key, setLen - 1)) ?? "";
      const data = await redis.hGetAll(popData);
      if (!!data) {
        const objEntries = Object.entries(data);
        const objValues = Object.values(data);
        popData.includes(redisHelper.DB_Add_User_Hash)
          ? await addData(DB.User_Table, objEntries, objValues)
          : popData.includes(redisHelper.DB_Update_User_Hash)
          ? await updateData(
              DB.User_Table,
              +popData.split(":")[1],
              objEntries,
              objValues
            )
          : await deleteData(DB.User_Table, +popData.split(":")[1]);
        await redis.multi().rPop(key).del(popData).exec();
      }
      setLen--;
      await redis.flushAll();
      console.log(`Data Maintained By Redis!!!`);
    }
  } catch (err) {
    console.log(err);
  }
}, REDIS.REDIS_TTL * 1000);

export { redis };
