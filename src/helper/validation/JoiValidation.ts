import type { NextFunction, Request, Response } from "express";
import Joi from "joi";

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
  gender: Joi.string().length(10),
  age: Joi.number().min(1).max(200),
  Dob: Joi.date().greater(new Date("1950-01-01")),
  timeStamp: Joi.string(),
});

const ValidateJoi = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = schema.validate(req.body);
    if (validator.error) throw new Error(validator.error.message);
    next();
  };
};

export { ValidateJoi };
