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

export interface HotelTableType {
  id: number;
  name: string;
  hotel_type: string;
  place: string;
  deleted: boolean;
}
