import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {Basket} from "../../../shop/basket/basket";
import {BasketService} from "../../../shop/basket/basket.service";
import {LoadingService} from "../../../shared/loading/loading.service";
import {LanguageApp} from "../../../shared/datatables/languages";
import {BasketitemService} from "../../../shop/basket/basketitem/basketitem.service";

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss']
})
export class OrderlistComponent implements OnInit {

  orderProducts$: Subscription = new Subscription();
  orders$: Subscription = new Subscription();
  orders: Basket[] = [];
  statuses: string[] = ["Basket", "Ordered", "Processing", "Shipped", "Delivered"];

  // Extra
  loading$ = this.loader.loading$;
  dtOptions: DataTables.Settings = {};

  constructor(private basketService: BasketService, private loader: LoadingService, private basketItemService: BasketitemService) { }

  ngOnInit(): void {
    this.dtOptions = {language: LanguageApp.dutch_datatables};
    this.getOrders();
  }

  getOrders(){
    this.loader.show();
    this.orders$ = this.basketService.getBaskets().subscribe(result => {
      this.loader.hide();
      this.orders = result.filter(o => o.status != 0);
      this.orderProducts$ = this.basketItemService.getBasketItems().subscribe(result => {
        this.orders.forEach((o) => {
          o.orderProducts = result.filter(bi => bi.orderId == o.id);
        });
      });
    });
  }
}
