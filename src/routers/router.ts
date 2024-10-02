import { Router } from "express";
import { AuthenticateUser } from "../helper/generalFunction";
import { AdminRouter } from "./Admin";
import { loginRouter } from "./login";
import { orderRouter } from "./order";
import { productRouter } from "./product";
import { userRouter } from "./user";

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
