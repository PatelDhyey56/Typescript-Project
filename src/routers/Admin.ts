import { Router } from "express";
import {
  AddData,
  AllData,
  DataById,
  DeleteData,
  UpdateData,
} from "../controller/generalFunctions";
import DB from "../helper/textHelpers/Db_helper";
import {
  HotelRegister,
  HotelUpdate,
  ProductMRegister,
  ProductMUpdate,
  ProductRegister,
  ProductUpdate,
  ValidateJoi,
} from "../helper/validation/JoiValidation";
import type { ObjectSchema } from "joi";

const CrudRouter = Router();

((routes: [string, string, ObjectSchema, ObjectSchema][]): void => {
  for (let route of routes) {
    CrudRouter.route(`${route[0]}`)
      .get(AllData(route[1]))
      .post(ValidateJoi(route[2]), AddData(route[1]));
    CrudRouter.route(`${route[0]}/:id`)
      .get(DataById(route[1]))
      .patch(ValidateJoi(route[3]), UpdateData(route[1]))
      .delete(DeleteData(route[1]));
  }
})([
  ["/crud/hotel", DB.Hotel_Table, HotelRegister, HotelUpdate],
  [
    "/crud/product-master",
    DB.Product_Maaster_Table,
    ProductMRegister,
    ProductMUpdate,
  ],
  ["/crud/product", DB.Products_Table, ProductRegister, ProductUpdate],
]);

export { CrudRouter };
