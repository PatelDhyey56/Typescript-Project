import type { NextFunction, Request, Response } from "express";
import Messages from "./textHelpers/messages";
import type { responseType } from "../types/globleTypes";

const genralResponse = (
  res: Response,
  status: number = 200,
  data: responseType = {
    message: Messages.DEFAULT_RESPONCE,
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

export { genralResponse, errorHandler };
