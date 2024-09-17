import { Router } from "express";
import { OrderValidate, ValidateJoi } from "../helper/validation/JoiValidation";
import { DeleteData } from "../services/generalFunctions";
import { AddOrder, UpdateOrder } from "../controller/orders";
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

const orderRouter = Router();

orderRouter
  .route("/order")
  .get(
    redisGetListOfData(
      DB.Order_Table,
      RedisMessages.See_Order_List,
      RedisMessages.See_Order_Hash,
      setObjectArrayCache,
      Messages.All_Orders
    )
  )
  .post(ValidateJoi(OrderValidate), AddOrder);
orderRouter
  .route("/order/:id")
  .get(
    redisGetDataById(
      DB.Order_Table,
      RedisMessages.See_Order_List,
      RedisMessages.See_Order_Hash,
      setObjectCache,
      Messages.All_Orders
    )
  )
  .patch(ValidateJoi(OrderValidate), UpdateOrder)
  .delete(DeleteData(DB.Order_Table));

export { orderRouter };
