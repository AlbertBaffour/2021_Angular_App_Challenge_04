import { Basket } from "../shop/basket/basket";

export interface Customer {
  id: number,
  firstName: string,
  lastName: string,
  streetAndNumber: string,
  postcode:string,
  city:string,
  phone: string,
  email: string,

  orders: Array<Basket>,

  userId: number
}
