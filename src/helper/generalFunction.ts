import type { NextFunction, Request, Response } from "express";
import Messages from "./textHelpers/messages";
import type { responseType } from "../types/globleTypes";
import jwt from "jsonwebtoken";
import { PASSKEY } from "../config";

const genralResponse = (
  res: Response,
  status: number = 200,
  data: responseType = {
    message: Messages.DEFAULT_RESPONSE,
  }
) => {
  res.status(status).send(data);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) return next();
  res.status(400).send({ message: err.message || Messages.SERVER_ERROR });
};

const ValidateUser = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  try {
    let verify = jwt.verify(token, String(PASSKEY));
    if (!verify) throw new Error(Messages.User_VALIDATE);
    next();
  } catch (e) {
    next(e);
  }
};
export { genralResponse, errorHandler, ValidateUser };
