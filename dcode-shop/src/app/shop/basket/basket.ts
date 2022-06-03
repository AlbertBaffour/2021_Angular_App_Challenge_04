import { Customer } from "src/app/admin/customer";
import { BasketItem } from "./basketitem/basketitem";
import { Status } from "./status";

export interface Basket {
  id: number;
  customerId: number;
  customer?: Customer;
  orderDate: Date;
  deliveryDate: Date;
  status: Status;
  totalPrice: number;
  orderProducts: Array<BasketItem>;
}
