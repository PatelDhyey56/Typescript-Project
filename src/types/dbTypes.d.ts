export interface RegisterType {
  email: string;
  password: string;
}
export interface UserTableType extends RegisterType {
  id?: number;
  fname?: string;
  lname?: string;
  mobileNo?: string;
  gender?: string;
  age?: number;
  Dob?: Date;
  timestamp?: Date;
}
