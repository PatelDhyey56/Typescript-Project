import { Router } from "express";
import { postLogin, postRegister } from "../controller/login";

const loginRouter = Router();

loginRouter.route("/register").post(postRegister);
loginRouter.route("/login").post(postLogin);

export { loginRouter };
