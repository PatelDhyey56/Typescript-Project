import { createClient } from "redis";
import { REDIS } from "../../../config/index";
import redisHelper from "../../textHelpers/redisHelper";
import { addData, updateData } from "../DbQueryHelper";

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
        popData.includes(redisHelper.DB_Update_User_Hash)
          ? await updateData(
              "User",
              +popData.split(":")[1],
              objEntries,
              objValues
            )
          : await addData("User", objEntries, objValues);
        await redis.multi().rPop(key).del(popData).exec();
      }
      setLen--;
      console.log(`Data Maintained By Redis!!!`);
    }
  } catch (err) {
    console.log(err);
  }
}, REDIS.REDIS_DATA_ENTRY_TIME);

export { redis };
