import { patterns } from "../helper/validation/validators";

export interface responseType {
  message: string;
  result?: Object;
  token?: string;
}

export interface ValidationType {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    length?: number;
    message: string;
  };
}
