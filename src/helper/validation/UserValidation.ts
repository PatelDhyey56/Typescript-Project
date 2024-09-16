import { registerValidCheck, putUserValidCheck } from "./validators";
import Messages from "../textHelpers/messages";
import type { NextFunction, Request, Response } from "express";
import type { ValidationType } from "../../types/globleTypes";

const registerUserValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bodyData = req.body;
  let bodyKeys: string[] = Object.keys(req.body);
  for (let e in registerValidCheck as ValidationType) {
    bodyKeys.pop();
    if (
      registerValidCheck[e]?.required &&
      (!registerValidCheck[e]?.pattern?.test(String(bodyData[e])) ||
        String(bodyData[e])?.trim().length >
          (registerValidCheck[e]?.length ?? Number.MAX_SAFE_INTEGER))
    )
      throw new Error(`Please Enter Valid ${registerValidCheck[e].message}`);
  }
  if (!!bodyKeys.length) throw new Error(Messages.VALIDATION_ERROR);
  next();
};

const putUserValidate = (req: Request, res: Response, next: NextFunction) => {
  const bodyData = req.body;
  let bodyKeys: string[] = Object.keys(req.body);
  for (let e in putUserValidCheck as ValidationType) {
    if (!bodyKeys.length) return next();
    bodyKeys.pop();
    if (
      registerValidCheck[e]?.required &&
      (!registerValidCheck[e]?.pattern?.test(String(bodyData[e])) ||
        String(bodyData[e])?.trim().length >
          (registerValidCheck[e]?.length ?? Number.MAX_SAFE_INTEGER))
    )
      throw new Error(`Please Enter Valid ${registerValidCheck[e].message}`);
  }
  if (!!bodyKeys.length) throw new Error(Messages.VALIDATION_ERROR);
  next();
};

export { registerUserValidate, putUserValidate };
