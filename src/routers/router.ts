import { Router } from "express";
import { loginRouter } from "./login";
import { userRouter } from "./user";
import { AuthenticateUser } from "../helper/generalFunction";
import { AdminRouter } from "./Admin";
import { orderRouter } from "./order";
import { productRouter } from "./product";

const router = Router();

router.use(
  loginRouter,
  AuthenticateUser,
  userRouter,
  AdminRouter,
  productRouter,
  orderRouter
);

export default router;
