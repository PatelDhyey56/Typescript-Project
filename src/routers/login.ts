import { Router } from "express";
import { postLogin, postRegister } from "../controller/login";
import {
  Authentication,
  ValidateJoi,
} from "../helper/validation/JoiValidation";

const loginRouter = Router();

loginRouter.route("/register").post(ValidateJoi(Authentication), postRegister);
loginRouter.route("/login").post(ValidateJoi(Authentication), postLogin);

export { loginRouter };
