import { Router } from "express";
import { userList } from "../controller/user";

const userRouter = Router();

userRouter.route("/").get(userList);

export { userRouter };
