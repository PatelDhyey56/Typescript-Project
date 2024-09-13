import { Router } from "express";
import { loginRouter } from "./login";
import { userRouter } from "./user";
import { ValidateUser } from "../helper/generalFunction";
import { CrudRouter } from "./hotel";

const router = Router();

router.use(loginRouter, ValidateUser, userRouter, CrudRouter);

export default router;
