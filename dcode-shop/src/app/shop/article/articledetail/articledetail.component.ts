import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/admin/adminarticle/article';
import { Customer } from 'src/app/admin/customer';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/user';
import { ArticleService } from 'src/app/shared/article.service';
import { CommunicationService } from 'src/app/shared/communication.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { Location } from "@angular/common";
import { Basket } from '../../basket/basket';
import { BasketService } from '../../basket/basket.service';
import { BasketItem } from '../../basket/basketitem/basketitem';
import { BasketitemService } from '../../basket/basketitem/basketitem.service';
import { Favorite } from '../../favorites/favorite';
import { FavoriteService } from '../../favorites/favorite.service';


@Component({
  selector: 'app-articledetail',
  templateUrl: './articledetail.component.html',
  styleUrls: ['./articledetail.component.scss']
})
export class ArticledetailComponent implements OnInit, OnDestroy {
  baseImgUrl=GlobalConstants.baseImgUrl;
  articleId: number = 0;
  article: Article = {id: 0, name: "", color: '', price: 0, isActive: true, description: '', categoryId: 1, quantityInStock: 0, brand: "", img: "", size: 0}
  article$: Subscription = new Subscription();
  loading$ = this.loader.loading$;
  currentUsr: User = { id: 0,    email: '',    password: '',    isActive: false,    isAdmin: false,   isSuperAdmin: false,  token: '',customerId: 0};
  customer: Customer = {    id: 0,firstName: '',    lastName: '',    streetAndNumber: '',  postcode: '',    city: '',    phone: '',    email: '',    orders: [],    userId: 0};
  @Input() isFavorite: boolean = false;


  basket: Basket = { id: 0, customerId: this.customer.id, customer: this.customer, orderDate: new Date(), deliveryDate: new Date(), status: 0, totalPrice: 0, orderProducts: [] };
  basket$: Subscription = new Subscription();
  postBasketItem$: Subscription = new Subscription();
  putBasketItem$: Subscription = new Subscription();
  basketItems$: Subscription = new Subscription();
  basketItems: BasketItem[] = [];

  postfav$: Subscription = new Subscription();
  deletefav$: Subscription = new Subscription();
  favs$: Subscription = new Subscription();
  favs: Favorite[] = [];
  // Used to know whether system is busy updating the basket
  updatingBasket: boolean = false;

  constructor(private location: Location, private basketService:BasketService,private basketItemService: BasketitemService, private articleService: ArticleService, private router: Router, private loader: LoadingService,
     private route: ActivatedRoute,private favService: FavoriteService, private authserv: AuthService,private communicationService: CommunicationService,private toastrService :ToastrService) {

    const articleId = this.route.snapshot.paramMap.get("id");

    if (articleId != null) {
      this.article$ = this.articleService.getArticleById(+articleId).subscribe(result => {
        this.article = result.data;
        this.loader.hide();
      })
    }
  }

  ngOnInit(): void {
    this.loader.show();
    if(localStorage.getItem("id") != null){
      this.Getcurruser();
      this.getCurrentBasket();
    }
  }

  return(){
    this.location.back();
  }

  ngOnDestroy(): void {
    this.article$.unsubscribe();
    this.postfav$.unsubscribe();
    this.deletefav$.unsubscribe();
    this.favs$.unsubscribe();
  }

  favorite() {
    this.isFavorite = !this.isFavorite;
    let isfav = false;
    let currfavId: number = 0;
    if (this.authserv.getUser() != null) {
      this.favs.forEach(fav => {
        if (fav.customerId == this.currentUsr.customerId && fav.productId == this.article.id) {
          isfav = true;
          currfavId = fav.id;
        }
      });
      if (isfav) {
        this.deletefav$ = this.favService.deleteFav(currfavId).subscribe(result => {
          this.GetUserFavs();
          this.showToasterRemoveFavoriteSuccess();
        }, error => {
          console.log(error.message);
        });
      }
      else {
        let newfav: Favorite = {
          id: 0,
          productId: this.article.id,
          customerId: this.currentUsr.customerId
        }
        this.postfav$ = this.favService.postFav(newfav).subscribe(result => {
          this.GetUserFavs();
          this.showToasterAddFavoriteSuccess();
        }, error => {
          console.log(error.message);
        });
      }
    }
    else {
      this.router.navigateByUrl("/login");
    }

  }

  Getcurruser() {
    let usr = this.authserv.getUser();
    if (usr != null) {
      this.currentUsr = usr;
      this.GetUserFavs();
    }
  }

  GetUserFavs() {
    this.favs = [];
    this.favs$ = this.favService.getFavs(this.currentUsr.customerId).subscribe(result => {
      result.forEach(item => {
        if (item.customerId == this.currentUsr.customerId) {
          this.favs.push(item);
        }
      });
      this.checkfavorite();
    });
  }

  checkfavorite() {
    this.isFavorite = false;
    this.favs.forEach(fav => {
      if (fav.customerId == this.currentUsr.customerId && fav.productId == this.article.id) {
        this.isFavorite = true;
      }
    });
  }

  getCurrentBasket() {
    this.basket$ = this.basketService.getBaskets().subscribe(results => {
      this.basket = results.filter(b => b.status === 0)[0];

      this.getItemsOfBasket(this.basket.id);

      // Done updating basket
      this.updatingBasket = false;
    });
  }

  getItemsOfBasket(basketId: number) {
    this.basketItems$ = this.basketItemService.getBasketItems().subscribe(result => {
      this.basketItems = result.filter(i => i.orderId === basketId);
    });
  }

  addToBasket() {
    // If article is already in basket, existingItems = Array with one item, else: existingItems = empty array
    let articleId = this.article.id;
    let existingItems = this.basketItems.filter(function (item) { return item.productId == articleId })

    // If article is not already in basket and system is not currently busy updating the basket
    if (existingItems.length == 0 && !this.updatingBasket) {
      // Start updating basket
      this.updatingBasket = true;

      // Create new basketItem
      let basketItem: BasketItem = { id: 0, productId: this.article.id, orderId: this.basket.id, quantity: 1, currentPrice: this.article.price, subtotal: this.article.price };
      this.postBasketItem$ = this.basketItemService.postBasketItem(basketItem).subscribe(results => {
        // update this.basket
        this.getCurrentBasket();

        // Update basket size in navbar
        this.communicationService.updateNavBasketSize();
        this.showToasterAddToBasketSuccess();
      });

    }
    // If article is already in basket
    else if (existingItems.length != 0) {
      // add 1 to quantity
      existingItems[0].quantity++;
      this.putBasketItem$ = this.basketItemService.putBasketItem(existingItems[0].id, existingItems[0]).subscribe(results => {
        this.showToasterAddToBasketPlus();
      });
    }
  }
  showToasterAddToBasketSuccess() {
    this.toastrService.success("Artikel toegevoegd aan uw winkelmandje!")
  }
  showToasterAddToBasketPlus() {
    this.toastrService.success("Aantal verhoogd in uw winkelmandje!")
  }

  showToasterAddFavoriteSuccess() {
    this.toastrService.success("Artikel toegevoegd aan uw favorieten!")
  }
  showToasterRemoveFavoriteSuccess() {
    this.toastrService.success("Artikel verwijderd uit uw favorieten!")
  }
}
