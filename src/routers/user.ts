import { Router } from "express";
import { deleteUser, updateUser } from "../controller/user";
import { UserUpdate, ValidateJoi } from "../helper/validation/JoiValidation";
import { photoUpload } from "../middleware/multer";
import { redisGetListOfData } from "../controller/redisGenralFunctions";
import DB from "../helper/textHelpers/Db_helper";
import RedisMessages from "../helper/textHelpers/redisHelper";
import { setObjectArrayCache } from "../helper/DbHelpers/redis/userRedis";
import Messages from "../helper/textHelpers/messages";

const userRouter = Router();

userRouter
  .route("/user")
  .get(
    redisGetListOfData(
      DB.User_Table,
      RedisMessages.See_User_List,
      RedisMessages.See_User_Hash,
      setObjectArrayCache,
      Messages.All_Users
    )
  );
userRouter
  .route("/user/:id")
  .get(
    redisGetListOfData(
      DB.User_Table,
      RedisMessages.See_User_List,
      RedisMessages.See_User_Hash,
      setObjectArrayCache,
      Messages.User_Get
    )
  )
  .patch(photoUpload.single("file"), ValidateJoi(UserUpdate), updateUser)
  .delete(deleteUser);

export { userRouter };
