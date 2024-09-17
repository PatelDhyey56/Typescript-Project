import { Router } from "express";
import {
  AddData,
  AllData,
  DataById,
  DeleteData,
  UpdateData,
} from "../services/generalFunctions";
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
import { photoUpload } from "../middleware/multer";

const AdminRouter = Router();

((routes: [string, string, ObjectSchema, ObjectSchema][]): void => {
  for (let route of routes) {
    AdminRouter.route(`${route[0]}`)
      .get(AllData(route[1]))
      .post(ValidateJoi(route[2]), AddData(route[1]));
    AdminRouter.route(`${route[0]}/:id`)
      .get(DataById(route[1]))
      .patch(ValidateJoi(route[3]), UpdateData(route[1]))
      .delete(DeleteData(route[1]));
  }
})([
  ["/crud/hotel", DB.Hotel_Table, HotelRegister, HotelUpdate],
  ["/crud/product", DB.Products_Table, ProductRegister, ProductUpdate],
]);

AdminRouter.route(`/crud/product-master`)
  .get(AllData(DB.Product_Maaster_Table))
  .post(
    photoUpload.single("file"),
    ValidateJoi(ProductMRegister),
    AddData(DB.Product_Maaster_Table)
  );
AdminRouter.route(`"/crud/product-master/:id`)
  .get(DataById(DB.Product_Maaster_Table))
  .patch(ValidateJoi(ProductMUpdate), UpdateData(DB.Product_Maaster_Table))
  .delete(DeleteData(DB.Product_Maaster_Table));

export { AdminRouter };
