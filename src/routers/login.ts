import { Router } from "express";
import { postLogin, postRegister } from "../controller/login";
import { registerUserValidate } from "../helper/validation/UserValidation";

const loginRouter = Router();

loginRouter.route("/register").post(registerUserValidate, postRegister);
loginRouter.route("/login").post(registerUserValidate, postLogin);

export { loginRouter };
