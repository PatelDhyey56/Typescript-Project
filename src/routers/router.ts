import { Router } from "express";
import { loginRouter } from "./login";
import { userRouter } from "./user";

const router = Router();

router.use(loginRouter, userRouter);

export default router;
