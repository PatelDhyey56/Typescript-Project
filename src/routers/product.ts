import { Router } from "express";
import DB from "../helper/textHelpers/Db_helper";
import RedisMessages from "../helper/textHelpers/redisHelper";
import Messages from "../helper/textHelpers/messages";
import {
  setObjectArrayCache,
  setObjectCache,
} from "../helper/DbHelpers/redis/userRedis";
import {
  redisGetDataById,
  redisGetListOfData,
} from "../services/redisGenralFunctions";

const productRouter = Router();

productRouter
  .route("/products")
  .get(
    redisGetListOfData(
      DB.All_Product_List,
      RedisMessages.See_Product_List,
      RedisMessages.See_Product_Hash,
      setObjectArrayCache,
      Messages.All_Products
    )
  );
productRouter
  .route("/products/:id")
  .get(
    redisGetDataById(
      DB.All_Product_List,
      RedisMessages.See_Product_List,
      RedisMessages.See_Product_Hash,
      setObjectCache,
      Messages.Product_Get
    )
  );

export { productRouter };
