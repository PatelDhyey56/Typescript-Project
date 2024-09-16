import type { NextFunction, Request, Response } from "express";
import {
  addData,
  selectByValues,
  updateData,
} from "../helper/DbHelpers/DbQueryHelper";
import DB from "../helper/textHelpers/Db_helper";
import Messages from "../helper/textHelpers/messages";
import { genralResponse } from "../helper/generalFunction";
import { DbTransactionEnd, DbTransactionStart, queryRun } from "../config/db";

const AddOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const Body: {
    user_id: number;
    product: { Product_id: number; Quantity: number }[];
    total: number;
  } = req.body;
  try {
    await DbTransactionStart();
    await selectByValues(DB.User_Table, [["id", String(Body.user_id)]]);
    for (let e of Body.product) {
      const product = await queryRun(
        `Update ${DB.Products_Table} SET quantity=quantity-${e.Quantity} Where id=${e.Product_id} and quantity >=${e.Quantity} returning *;`
      );
      if (!product.length) throw new Error(Messages.Item_VALIDATE);
    }
    await addData(
      DB.Order_Table,
      Object.entries(Body).map((e) => [e[0], JSON.stringify(e[1])]),
      Object.values(Body).map((e) => JSON.stringify(e))
    );
    await DbTransactionEnd();
    genralResponse(res, 200, {
      message: Messages.Order_Add,
    });
  } catch (e) {
    next(e);
  }
};

const UpdateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const Body: {
    user_id: number;
    product: { Product_id: number; Quantity: number }[];
    total: number;
  } = req.body;
  try {
    await DbTransactionStart();
    await selectByValues(DB.User_Table, [["id", String(Body.user_id)]]);
    for (let e of Body.product) {
      const product = await queryRun(
        `Update ${DB.Products_Table} SET quantity=quantity-${e.Quantity} Where id=${e.Product_id} and quantity >=${e.Quantity} returning *;`
      );
      if (!product.length) throw new Error(Messages.Item_VALIDATE);
    }
    const UpdatedData = await updateData(
      DB.Order_Table,
      +id,
      Object.entries(Body).map((e) => [e[0], JSON.stringify(e[1])]),
      Object.values(Body).map((e) => JSON.stringify(e))
    );
    if (!UpdatedData.length) throw new Error(Messages.Item_VALIDATE);
    await DbTransactionEnd();
    genralResponse(res, 200, {
      message: Messages.Order_Update,
    });
  } catch (e) {
    next(e);
  }
};
export { AddOrder, UpdateOrder };
