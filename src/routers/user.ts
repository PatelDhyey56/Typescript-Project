import { Router } from "express";
import { deleteUser, updateUser, userById, userList } from "../controller/user";
import { putUserValidate } from "../helper/validation/UserValidation";

const userRouter = Router();

userRouter.route("/").get(userList);
userRouter
  .route("/:id")
  .get(userById)
  .put(putUserValidate, updateUser)
  .delete(deleteUser);

export { userRouter };
