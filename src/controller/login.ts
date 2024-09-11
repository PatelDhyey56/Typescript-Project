import type { NextFunction, Request, Response } from "express";
import { genralResponse } from "../helper/generalFunction";
import { addData, selectByValues } from "../helper/DbHelpers/DbQueryHelper";
import Messages from "../helper/textHelpers/messages";
import type { RegisterType, UserTableType } from "../types/dbTypes";
import jwt from "jsonwebtoken";
import { PASSKEY } from "../config";

const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const BodyEntries = Object.entries(req.body as RegisterType);
  const bodyValues = Object.values(req.body as RegisterType);
  try {
    await addData("User", BodyEntries, bodyValues);
    genralResponse(res, 200, { message: Messages.User_Login });
  } catch (e) {
    next(e);
  }
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as RegisterType;
  try {
    const user = await selectByValues("User", [["email", email]], "AND");
    if (user.password === password) {
      const token = jwt.sign(req.body, String(PASSKEY));
      genralResponse(res.cookie("token", token), 200, {
        message: Messages.User_Login,
        token,
        result: user,
      });
    } else {
      genralResponse(res, 200, {
        message: Messages.User_VALIDATE,
      });
    }
  } catch (e) {
    next(e);
  }
};

export { postRegister, postLogin };
