import type { NextFunction, Request, Response } from "express";
import {
  addData,
  selectByValues,
  selectTable,
  updateData,
} from "../helper/DbHelpers/DbQueryHelper";
import Messages from "../helper/textHelpers/messages";
import { genralResponse } from "../helper/generalFunction";

let result;
const AllData =
  (tableName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      result = await selectTable(tableName);
      genralResponse(res, 200, { message: Messages.All_Users, result });
    } catch (e) {
      next(e);
    }
  };

const AddData =
  (tableName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const objEntries = Object.entries(req.body) as [string, string][];
    const objValues = Object.values(req.body) as string[];
    try {
      if (req.file) {
        objEntries.push(["image", req.file.filename]);
        objValues.push(req.file.filename);
      }
      result = await addData(tableName, objEntries, objValues);
      genralResponse(res, 200, { message: Messages.All_Users, result });
    } catch (e) {
      next(e);
    }
  };

const DataById =
  (tableName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
      result = await selectByValues(tableName, [["id", id]]);
      genralResponse(res, 200, { message: Messages.All_Users, result });
    } catch (e) {
      next(e);
    }
  };

const UpdateData =
  (tableName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    console.log(req.body);
    const objEntries = Object.entries(req.body) as [string, string][];
    const objValues = Object.values(req.body) as string[];
    try {
      result = await updateData(tableName, +id, objEntries, objValues);
      genralResponse(res, 200, { message: Messages.All_Users, result });
    } catch (e) {
      next(e);
    }
  };

const DeleteData =
  (tableName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
      result = await updateData(
        tableName,
        +id,
        [["deleted", "true"]],
        ["true"]
      );
      genralResponse(res, 200, { message: Messages.All_Users, result });
    } catch (e) {
      next(e);
    }
  };

export { AllData, AddData, DataById, UpdateData, DeleteData };
