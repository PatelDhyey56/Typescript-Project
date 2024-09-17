import type { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const ValidateJoi = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = schema.validate(req.body);
    if (validator.error) throw new Error(validator.error.message);
    next();
  };
};
enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}
enum HotelType {
  "5-star" = "5-star",
  "3-star" = "3-star",
  Dhaba = "Dhaba",
  stall = "stall",
}
enum ProductEatType {
  Vegetarian = "Vegetarian",
  "Non-Vegetarian" = "Non-Vegetarian",
}

export const Authentication = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(8).required(),
});

export const UserUpdate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(8).required(),
  id: Joi.number().min(1),
  fname: Joi.string(),
  lname: Joi.string(),
  mobileNo: Joi.string().length(10),
  gender: Joi.string().valid(...Object.values(Gender)),
  age: Joi.number().min(1).max(200),
  Dob: Joi.date().greater(new Date("1950-01-01")),
  timeStamp: Joi.string(),
});
export const HotelRegister = Joi.object({
  name: Joi.string().max(45).required(),
  hotel_type: Joi.string()
    .valid(...Object.values(HotelType))
    .required(),
  place: Joi.string().max(45).required(),
});
export const HotelUpdate = Joi.object({
  name: Joi.string().max(45),
  hotel_type: Joi.string().valid(...Object.values(HotelType)),
  place: Joi.string().max(45),
  deleted: Joi.boolean(),
});

export const ProductMRegister = Joi.object({
  product_name: Joi.string().max(45).required(),
  eat_by: Joi.string()
    .valid(...Object.values(ProductEatType))
    .required(),
  product_type: Joi.string().max(45).required(),
});
export const ProductMUpdate = Joi.object({
  product_name: Joi.string().max(45),
  eat_by: Joi.string().valid(...Object.values(ProductEatType)),
  product_type: Joi.string().max(45),
  place: Joi.string().max(45),
  deleted: Joi.boolean(),
});

export const ProductRegister = Joi.object({
  hotel_id: Joi.number().min(1).required(),
  product_id: Joi.number().min(1).required(),
  price: Joi.number().min(1).required(),
  quantity: Joi.number().min(1).required(),
});
export const ProductUpdate = Joi.object({
  hotel_id: Joi.number().min(1),
  product_id: Joi.number().min(1),
  price: Joi.number().min(1),
  quantity: Joi.number().min(1),
  deleted: Joi.boolean(),
});

export const OrderValidate = Joi.object({
  user_id: Joi.number().min(1).required(),
  product: Joi.array()
    .items(
      Joi.object({
        Product_id: Joi.number().min(1).required(),
        Quantity: Joi.number().min(1).required(),
      }).required()
    )
    .required(),
  total: Joi.number().min(1).required(),
});
