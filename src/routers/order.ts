import { Router } from "express";
import { updateUser } from "../controller/user";
import { OrderValidate, ValidateJoi } from "../helper/validation/JoiValidation";
import {
  AllData,
  DataById,
  DeleteData,
  redisGetListOfData,
} from "../controller/generalFunctions";
import DB from "../helper/textHelpers/Db_helper";
import { AddOrder } from "../controller/orders";
import RedisMessages from "../helper/textHelpers/redisHelper";
import { setObjectArrayCache } from "../helper/DbHelpers/redis/userRedis";
import Messages from "../helper/textHelpers/messages";

const orderRouter = Router();

orderRouter
  .route("/products")
  .get(
    redisGetListOfData(
      DB.All_Product_List,
      RedisMessages.See_Product_List,
      RedisMessages.See_Product_Hash,
      setObjectArrayCache,
      Messages.All_Users
    )
  );
orderRouter
  .route("/order")
  .get(AllData(DB.Order_Table))
  .post(ValidateJoi(OrderValidate), AddOrder);
orderRouter
  .route("/order/:id")
  .get(DataById(DB.Order_Table))
  .patch(ValidateJoi(OrderValidate), updateUser)
  .delete(DeleteData(DB.Order_Table));

export { orderRouter };
