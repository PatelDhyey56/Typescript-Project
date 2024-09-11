import type { NextFunction, Request, Response } from "express";
import { genralResponse } from "../helper/generalFunction";
import { selectTable } from "../helper/DbHelpers/DbQueryHelper";
import messages from "../helper/textHelpers/messages";
let result;
const userList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    result = await selectTable("User");
    genralResponse(res, 200, { message: messages.ALL_PROFILES, result });
  } catch (e) {
    next(e);
  }
};
export { userList };
