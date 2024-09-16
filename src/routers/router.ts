import { Router } from "express";
import { loginRouter } from "./login";
import { userRouter } from "./user";
import { ValidateUser } from "../helper/generalFunction";
import { CrudRouter } from "./Admin";
import { orderRouter } from "./order";

const router = Router();

router.use(loginRouter, ValidateUser, userRouter, CrudRouter, orderRouter);

export default router;
