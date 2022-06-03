import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Basket} from '../basket/basket';
import {BasketService} from '../basket/basket.service';
import {LoadingService} from "../../shared/loading/loading.service";
import {AuthService} from 'src/app/security/auth.service';
import {CustomerService} from 'src/app/superadmin/adminusers/customer.service';
import {User} from 'src/app/security/user';
import {Customer} from 'src/app/admin/customer';
import {BasketitemService} from '../basket/basketitem/basketitem.service';
import {LanguageApp} from "../../shared/datatables/languages";
import {skip} from "rxjs/operators";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders: Basket[] = [];
  orders$: Subscription = new Subscription();

  statusses = ['winkelmand', 'besteld', 'wordt verwerkt', 'verzonden', 'geleverd'];

  dtOptions: DataTables.Settings = {};
  loading$ = this.loader.loading$;

  currentUser: User = {
    id: 0,
    email: '',
    password: '',
    isActive: false,
    isAdmin: false,
    isSuperAdmin: false,
    token: '',
    customerId: 0
  };

  currentCustomer: Customer = {
    id: 0,
    firstName: '',
    lastName: '',
    streetAndNumber: '',
    postcode: '',
    city: '',
    phone: '',
    email: '',
    orders: [],
    userId: 0
  };
  currentCustomer$: Subscription = new Subscription();
  basketItems$: Subscription = new Subscription();
  putBasket$: Subscription = new Subscription();


  constructor(private router: Router, private basketService: BasketService, private loader: LoadingService, private authService: AuthService, private customerService: CustomerService, private basketItemService: BasketitemService) {
  }

  ngOnInit(): void {
    this.dtOptions = {language: LanguageApp.dutch_datatables};
    this.loader.show();
    this.getCurrentUser();
    this.getCurrentCustomer();
  }

  ngOnDestroy(): void {
    this.orders$.unsubscribe();
    this.currentCustomer$.unsubscribe();
    this.basketItems$.unsubscribe();
    this.putBasket$.unsubscribe();
  }

  viewBasket(id: number) {
    let selectedOrder = this.orders.filter(o => o.id == id)[0];
    // If status of this order is 'winkelmand' -> current mode
    if (selectedOrder.status == 0) {
      this.router.navigate(['basket']);
    } else {
      this.router.navigate(['orders/', id]);
    }
  }

  getCurrentUser() {
    let usr = this.authService.getUser();
    if (usr != null) {
      this.currentUser = usr;
    }
  }

  getCurrentCustomer() {
    this.currentCustomer$ = this.customerService.getCustById(this.currentUser.customerId).subscribe(results => {
      this.currentCustomer = results;
      this.getOrders();
    });
  }

  getOrders() {
    this.orders$ = this.basketService.getBaskets().subscribe(results => {
      this.orders = results.filter(o => o.customerId == this.currentCustomer.id);
      this.getBasketItems();
    });
  }

  getBasketItems() {
    let self = this;
    this.orders.forEach((order, index, orders) => {
      let isLastOrder = false;

      // Bij laatste iteratie
      if (index == orders.length - 1) {
        isLastOrder = true;
      }
      self.getItemsOfOrder(order, isLastOrder);
    });
  }

  getItemsOfOrder(order: Basket, isLastOrder: boolean) {
    this.basketItems$ = this.basketItemService.getBasketItems().subscribe(result => {
      order.orderProducts = result.filter(i => i.orderId === order.id);
      this.calculateTotalPrice(order, isLastOrder);
    });
  }

  calculateTotalPrice(order: Basket, isLastOrder: boolean) {
    order.totalPrice = 0;
    order.orderProducts.forEach(item => {
      order.totalPrice += item.subtotal;
    });

    order.totalPrice = Math.round(order.totalPrice * 100) / 100;
    this.updateBasket(order, isLastOrder);
  }

  updateBasket(order: Basket, isLastOrder: boolean) {
    this.putBasket$ = this.basketService.putBasket(order.id, order).subscribe(result => {
      if (isLastOrder) {
        this.orders = this.orders.filter(o => o.status != 0)
        this.loader.hide();
      }
    });
  }
}
