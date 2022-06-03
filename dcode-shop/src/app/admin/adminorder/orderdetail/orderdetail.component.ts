import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {Basket} from "../../../shop/basket/basket";
import {BasketService} from "../../../shop/basket/basket.service";
import {Subscription} from "rxjs";
import {CustomerService} from "../../../superadmin/adminusers/customer.service";
import {BasketitemService} from "../../../shop/basket/basketitem/basketitem.service";
import {ArticleService} from "../../../shared/article.service";
import {Article} from "../../adminarticle/article";
import {LoadingService} from "../../../shared/loading/loading.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {

  articles$: Subscription = new Subscription();
  basketItem$: Subscription = new Subscription();
  customer$: Subscription = new Subscription();
  order$: Subscription = new Subscription();
  order: Basket = {
    id: 0,
    orderDate: new Date(),
    status: 0,
    orderProducts: [],
    customer: {
      id: 0,
      firstName: "",
      city: "",
      email: "",
      lastName: "",
      phone: "",
      postcode: "",
      userId: 0,
      streetAndNumber: "",
      orders: [],
    },
    deliveryDate: new Date(),
    totalPrice: 0,
    customerId: 0
  }
  totalPrice: number = 0;
  articles: Article[] = [];

  // Extra
  loading$ = this.loader.loading$;


  constructor(private location: Location, private loader: LoadingService, private articleService: ArticleService, private basketItemService: BasketitemService, private route: ActivatedRoute, private basketService: BasketService, private router: Router, private customerService: CustomerService) {
  }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId != null || "") {
      this.loader.show();
      this.getOrder(+orderId!);
    } else {
      this.router.navigate(['**']);
    }
  }

  getOrder(orderId: number) {
    this.order$ = this.basketService.getBasketById(+orderId!).subscribe(result => {
      this.order = result;
      this.getCustomer(result.customerId);
      this.getOrderArticles(orderId);
    });
  }

  getCustomer(customerId: number) {
    this.customer$ = this.customerService.getCustById(customerId).subscribe(result => {
      this.order.customer = result;
    });
  }

  getOrderArticles(orderId: number) {
    this.basketItem$ = this.basketItemService.getBasketItems().subscribe(result => {
      this.order.orderProducts = result.filter(bi => bi.orderId == orderId)
      if (this.order.orderProducts.length == 0){
        // Geen artikelen in order gevonden
        this.loader.hide();
      }
      else{
        this.getArticles();
      }
    });
  }

  getArticles() {
    this.articles$ = this.articleService.getArticlesAdmin().subscribe(result => {
      this.order.orderProducts.forEach((bi) => {
        let article = result.filter(a => a.id == bi.productId)[0]
        this.totalPrice += article.price
        this.articles.push(article);
        this.loader.hide();
      });
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.customer$.unsubscribe();
    this.order$.unsubscribe();
    this.basketItem$.unsubscribe();
    this.articles$.unsubscribe();
  }
}
