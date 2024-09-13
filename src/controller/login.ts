import type { NextFunction, Request, Response } from "express";
import { genralResponse } from "../helper/generalFunction";
import { addData, selectByValues } from "../helper/DbHelpers/DbQueryHelper";
import Messages from "../helper/textHelpers/messages";
import DB from "../helper/textHelpers/Db_helper";
import type { RegisterType } from "../types/dbTypes";
import jwt from "jsonwebtoken";
import { SERVER } from "../config";

const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const BodyEntries = Object.entries(req.body as RegisterType);
  const bodyValues = Object.values(req.body as RegisterType);
  try {
    await addData(DB.User_Table, BodyEntries, bodyValues);
    genralResponse(res, 200, { message: Messages.User_Login });
  } catch (e) {
    next(e);
  }
};

const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body as RegisterType;
  try {
    const user = await selectByValues(DB.User_Table, [["email", email]], "AND");
    if (user.password === password) {
      const token = jwt.sign(req.body, SERVER.PASSKEY);
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
