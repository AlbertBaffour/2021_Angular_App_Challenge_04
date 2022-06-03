import { Customer } from '../admin/customer';

export interface UserResponse {
  id: number;
  customerId:number;
  firstName:string;
  lastName:string;
  email: string;
  password: string;
  isActive:boolean;
  isAdmin:boolean;
  isSuperAdmin:boolean;
  token: string;
  customer:Customer;
}
