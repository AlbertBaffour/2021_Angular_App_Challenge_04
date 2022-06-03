import { Customer } from "../admin/customer";

export interface User {
  id: number;
  email: string;
  password: string;
  isActive:boolean;
  isAdmin:boolean;
  isSuperAdmin:boolean;
  token: string;
  customerId: number;

}
