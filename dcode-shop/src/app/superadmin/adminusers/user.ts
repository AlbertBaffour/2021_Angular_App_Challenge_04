import { Customer } from "src/app/admin/customer";

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  isActive: boolean,
  isAdmin: boolean,
  isSuperAdmin: boolean,
  customerId: number,
  customer: Customer

  token: string
}
