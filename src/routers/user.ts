import { Router } from "express";
import { deleteUser, updateUser, userById, userList } from "../controller/user";
import { UserUpdate, ValidateJoi } from "../helper/validation/JoiValidation";

const userRouter = Router();

userRouter.route("/").get(userList);
userRouter
  .route("/:id")
  .get(userById)
  .put(ValidateJoi(UserUpdate), updateUser)
  .delete(deleteUser);

export { userRouter };
