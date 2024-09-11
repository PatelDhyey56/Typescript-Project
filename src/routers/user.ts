import { Router } from "express";
import { deleteUser, updateUser, userById, userList } from "../controller/user";

const userRouter = Router();

userRouter.route("/").get(userList);
userRouter.route("/:id").get(userById).put(updateUser).delete(deleteUser);

export { userRouter };
