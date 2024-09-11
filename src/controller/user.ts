import type { NextFunction, Request, Response } from "express";
import { genralResponse } from "../helper/generalFunction";
import {
  deleteData,
  selectByValues,
  selectTable,
  updateData,
} from "../helper/DbHelpers/DbQueryHelper";
import Messages from "../helper/textHelpers/messages";
import type { UserTableType } from "../types/dbTypes";

let result: UserTableType | UserTableType[];
const userList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    result = await selectTable("User");
    genralResponse(res, 200, { message: Messages.All_Users, result });
  } catch (e) {
    next(e);
  }
};

const userById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    result = await selectByValues("User", [["id", id]]);
    genralResponse(res, 200, { message: Messages.User_Get, result });
  } catch (e) {
    next(e);
  }
};

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const BodyEntries = Object.entries(req.body as UserTableType);
  const BodyValues = Object.values(req.body as UserTableType);
  try {
    await selectByValues("User", [["id", id]]);
    result = await updateData("User", +id, BodyEntries, BodyValues);
    genralResponse(res, 200, { message: Messages.User_Updated, result });
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    await selectByValues("User", [["id", id]]);
    result = await deleteData("User", +id);
    genralResponse(res, 200, { message: Messages.User_Delete, result });
  } catch (e) {
    next(e);
  }
};

export { userList, userById, updateUser, deleteUser };
