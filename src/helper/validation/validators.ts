import type { ValidationType } from "../../types/globleTypes";

export const patterns = {
  textOnly: new RegExp("^[a-zA-Z\\s]+$"),
  numberOnly: new RegExp("^\\d+$"),
};

export const registerValidCheck: ValidationType = {
  email: {
    required: true,
    pattern: patterns.textOnly,
    message: "Email must be Provided",
  },
  password: {
    required: true,
    pattern: patterns.textOnly,
    length: 8,
    message:
      "password length must be less or equl to 8 and it Will be text only",
  },
};

export const putUserValidCheck: ValidationType = {
  fname: {
    required: false,
    pattern: patterns.textOnly,
    length: 20,
    message:
      "first-Name length must be less or equl to 20 and it Will be text only",
  },
  lname: {
    required: false,
    pattern: patterns.textOnly,
    length: 20,
    message:
      "last-Name length must be less or equl to 20 and it Will be text only",
  },
  moileNo: {
    required: false,
    pattern: patterns.numberOnly,
    length: 10,
    message:
      "Phone-No length must be less or equl to 8 and it Will be Number only",
  },
  gender: {
    required: false,
    pattern: patterns.textOnly,
    length: 8,
    message: "Gender length must be less or equl to 8 and it Will be text only",
  },
  age: {
    required: false,
    pattern: patterns.numberOnly,
    length: 3,
    message: "age Will be Number only",
  },
  Dob: {
    required: false,
    pattern: patterns.textOnly,
    message: "Dob must be in Date Format",
  },
};
