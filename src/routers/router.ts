import { Router } from "express";
import { loginRouter } from "./login";
import { userRouter } from "./user";
import { ValidateUser } from "../helper/generalFunction";

const router = Router();

router.use(loginRouter, ValidateUser, userRouter);

export default router;
