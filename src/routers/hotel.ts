import { Router } from "express";
import {
  AllData,
  DataById,
  DeleteData,
  UpdateData,
} from "../controller/generalFunctions";
import DB from "../helper/textHelpers/Db_helper";

const CrudRouter = Router();

CrudRouter.route("/crud/hotel").get(AllData(DB.Hotel_Table));
CrudRouter.route("/crud/hotel/:id")
  .get(DataById(DB.Hotel_Table))
  .put(UpdateData(DB.Hotel_Table))
  .delete(DeleteData(DB.Hotel_Table));

CrudRouter.route("/crud/product-master").get(AllData(DB.Product_Maaster_Table));
CrudRouter.route("/crud/product-master/:id")
  .get(DataById(DB.Product_Maaster_Table))
  .put(UpdateData(DB.Product_Maaster_Table))
  .delete(DeleteData(DB.Product_Maaster_Table));

CrudRouter.route("/crud/product").get(AllData(DB.Products_Table));
CrudRouter.route("/crud/product")
  .get(DataById(DB.Products_Table))
  .put(UpdateData(DB.Products_Table))
  .delete(DeleteData(DB.Products_Table));

export { CrudRouter };
