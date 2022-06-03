import {DatePipe, Location} from '@angular/common';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Basket} from './basket';
import {BasketService} from './basket.service';
import {BasketItem} from './basketitem/basketitem';
import {BasketitemService} from './basketitem/basketitem.service';
import {Status} from './status';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from "../../shared/loading/loading.service";
import {CommunicationService} from 'src/app/shared/communication.service';
import {Customer} from 'src/app/admin/customer';
import {CustomerService} from 'src/app/superadmin/adminusers/customer.service';
import {User} from 'src/app/security/user';
import {AuthService} from 'src/app/security/auth.service';
import {FavoriteService} from '../favorites/favorite.service';
import {Favorite} from '../favorites/favorite';
import {Mail} from 'src/app/shared/mail/mail';
import {MailService} from 'src/app/shared/mail/mail.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, OnDestroy {

  mode = "";

  putBasket$: Subscription = new Subscription();
  postBasket$: Subscription = new Subscription();
  basket$: Subscription = new Subscription();

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

  updateBasketItem$: Subscription = new Subscription();

  getLatestBasket$: Subscription = new Subscription();
  latestBasket: Basket = {
    id: 0,
    customerId: this.currentCustomer.id,
    customer: this.currentCustomer,
    orderDate: new Date(),
    deliveryDate: new Date(),
    status: 0,
    totalPrice: 0,
    orderProducts: []
  };

  @Input() basket: Basket = {
    id: 0,
    customerId: this.currentCustomer.id,
    customer: this.currentCustomer,
    orderDate: new Date(),
    deliveryDate: new Date(),
    status: 0,
    totalPrice: 0,
    orderProducts: []
  };

  basketItems$: Subscription = new Subscription();
  basketItems: BasketItem[] = [];

  postCurrentBasket$: Subscription = new Subscription();

  constructor(private mailService: MailService, private router: Router,
              private route: ActivatedRoute, private basketService: BasketService, private basketItemService: BasketitemService, private datePipe: DatePipe,
              private location: Location, private loader: LoadingService, private customerService: CustomerService, private authService: AuthService) {
    const orderId = this.route.snapshot.paramMap.get('id');

    // if an orderId was provided (routed to /orders/:id)
    if (orderId != null) {
      // Get basket by orderId;
      this.getBasketById(+orderId);
      this.mode = "history";
    }
    // if no orderId was provided (routed to /basket)
    else {
      // Get current order (basket)
      this.getCurrentBasket();
      this.mode = "current";
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.basket$.unsubscribe();
    this.basketItems$.unsubscribe();
    this.putBasket$.unsubscribe();
    this.postBasket$.unsubscribe();
    this.currentCustomer$.unsubscribe();
    this.updateBasketItem$.unsubscribe();
    this.getLatestBasket$.unsubscribe();
    this.postCurrentBasket$.unsubscribe();
  }

  getCurrentUser() {
    let usr = this.authService.getUser();
    if (usr != null) {
      this.currentUser = usr;
    }
  }

  getCurrentCustomer() {
    this.getCurrentUser();

    this.currentCustomer$ = this.customerService.getCustById(this.currentUser.customerId).subscribe(results => {
      this.currentCustomer = results;

      this.getCurrentBasketByCustomer()
    });
  }

  getCurrentBasketByCustomer() {
    this.basket$ = this.basketService.getBaskets().subscribe(results => {
      let basket = results.filter(b => b.customerId === this.currentCustomer.id && b.status === 0)[0];

      // If customer doesn't have a basket yet
      if (!basket) {
        // Create a basket for customer
        let newBasket: Basket = {
          id: 0,
          customerId: this.currentCustomer.id,
          orderDate: new Date(),
          deliveryDate: new Date(),
          status: 0,
          totalPrice: 0,
          orderProducts: []
        };

        this.postCurrentBasket$ = this.basketService.postBasket(newBasket).subscribe(result => {
          this.basket = result;
          this.getItemsOfBasket(this.basket.id);
        });
      } else {
        this.basket = basket;
        this.getItemsOfBasket(this.basket.id);
      }
    });
  }

  getCurrentBasket() {
    this.loader.show();
    this.getCurrentCustomer();
  }

  getBasketById(id: number) {
    this.loader.show();

    this.basket$ = this.basketService.getBasketById(id).subscribe(result => {
      this.basket = result;

      this.getItemsOfBasket(this.basket.id);
    });
  }

  getItemsOfBasket(basketId: number) {
    this.loader.show();

    this.basketItems$ = this.basketItemService.getBasketItems().subscribe(result => {
      this.basketItems = result.filter(i => i.orderId === basketId);

      this.basket.orderProducts = this.basketItems;

      this.loader.hide();

      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    this.basket.totalPrice = 0;
    this.basketItems.forEach(item => {
      this.basket.totalPrice += item.subtotal;
    });

    this.basket.totalPrice = Math.round(this.basket.totalPrice * 100) / 100;

    this.updateBasket();
  }

  updateBasket() {
    this.putBasket$ = this.basketService.putBasket(this.basket.id, this.basket).subscribe(result => {
    });
  }

  orderBasket() {
    // Kopie maken van winkelmand met status "besteld"
    let newBasket = this.basket;
    newBasket.id = 0;
    newBasket.orderProducts = [];
    newBasket.customer = undefined;

    // status = "besteld"
    newBasket.status = 1;

    // orderDate = now
    this.basket.orderDate = new Date();

    // deliveryDate = 1 week from now
    let deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    this.basket.deliveryDate = deliveryDate;

    this.postBasket$ = this.basketService.postBasket(newBasket).subscribe(result => {
      this.composeAndSendMail(result.id);
      // Laatste basket ophalen
      this.getLatestBasket();
    });
  }

  getLatestBasket() {
    this.getLatestBasket$ = this.basketService.getBaskets().subscribe(results => {
      this.latestBasket = results[0];

      // Items uit winkelmand verplaatsen naar kopie (-> currentBasket leegmaken)
      this.emptyCurrentBasket();
    });
  }

  emptyCurrentBasket() {
    let self = this;
    this.basketItems.forEach(function (item, index, basketItems) {
      item.orderId = self.latestBasket.id;
      self.updateBasketItem$ = self.basketItemService.putBasketItem(item.id, item).subscribe(result => {
        // Na laatste iteratie
        if (index == basketItems.length - 1) {
          self.router.navigate(["checkout"], {state: {OrderId: self.latestBasket.id, OrderItems: basketItems}});
        }
      });
    });
  }

  getTitleText(): string {
    if (this.basket) {
      if (this.basket.status === 0) {
        return "Winkelmand";
      } else {
        return "Bestelling van " + this.datePipe.transform(this.basket.orderDate, 'd/M/y');
      }

    } else {
      return "Winkelmand";
    }
  }

  goBack() {
    this.location.back();
  }


  composeAndSendMail(id: number) {
    var msg = "<style>" +
      "  table, th, td {" +
      "   border:0;}" +
      "</style>" +
      "<div>" +
      "<i style='color: green' class='far fa-check-circle fa-7x'></i>" +
      "</div>" +
      "<h1>Bedankt voor uw bestelling!</h1>" +
      "<p class='mt-3 text-center'>We gaan zo snel mogelijk aan de slag met uw bestelde artikelen. </p>" +
      "<div >" +
      "<div>" ;


    this.mailService.sendMail({

      "recipientEmail": this.currentCustomer.email,
      "recipientName": this.currentCustomer.firstName + "_" + this.currentCustomer.lastName,
      "subject": "Bedankt voor uw bestelling!",
      "message": msg,
      "orderId": id
    }).subscribe(
      data => {
        console.log("Mail sent: ", data)
      },
      error => {
        console.log("Error: ", error)
      }
    )
  }
}
