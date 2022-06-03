import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderlistComponent } from './orderlist/orderlist.component';
import {AdminModule} from "../admin.module";
import {SharedModule} from "../../shared/shared.module";
import { OrderdetailComponent } from './orderdetail/orderdetail.component';



@NgModule({
  declarations: [
    OrderlistComponent,
    OrderdetailComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AdminorderModule { }
