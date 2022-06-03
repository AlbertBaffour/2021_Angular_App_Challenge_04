import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/admin/adminarticle/article';
import { Customer } from 'src/app/admin/customer';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/user';
import { CommunicationService } from 'src/app/shared/communication.service';
import { CustomerService } from 'src/app/superadmin/adminusers/customer.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Basket } from '../basket/basket';
import { BasketService } from '../basket/basket.service';
import { BasketItem } from '../basket/basketitem/basketitem';
import { BasketitemService } from '../basket/basketitem/basketitem.service';
import { Favorite } from '../favorites/favorite';
import { FavoriteService } from '../favorites/favorite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  @Input() article: Article = { id: 0, categoryId: 0, color: "", name: "", brand: "", price: 0, description: "", isActive: true, quantityInStock: 0, img: "", size: 0 };

  @Input() isFavorite: boolean = false;
  @Input() isOutOfStock: boolean = false;
  @Input() isSuggestion: boolean = false;

  // Used to know if this article-component is part of Favorites page (or shop page)
  @Input() isPartOfMyFavorites: boolean = false;

  @Output("deleteFavorite") deleteFavorite: EventEmitter<string> = new EventEmitter();

  postfav$: Subscription = new Subscription();
  deletefav$: Subscription = new Subscription();
  favs$: Subscription = new Subscription();
  favs: Favorite[] = [];
  currentUsr: User = {
    id: 0,
    email: '',
    password: '',
    isActive: false,
    isAdmin: false,
    isSuperAdmin: false,
    token: '',
    customerId: 0
  };

  customer: Customer = {
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

  basket: Basket = { id: 0, customerId: this.customer.id, customer: this.customer, orderDate: new Date(), deliveryDate: new Date(), status: 0, totalPrice: 0, orderProducts: [] };
  basket$: Subscription = new Subscription();
  baseImgUrl = GlobalConstants.baseImgUrl;
  postBasketItem$: Subscription = new Subscription();
  putBasketItem$: Subscription = new Subscription();
  basketItems$: Subscription = new Subscription();
  basketItems: BasketItem[] = [];

  // Used to know whether system is busy updating the basket
  updatingBasket: boolean = false;

  constructor(private favService: FavoriteService, private authserv: AuthService, private router: Router, private basketService: BasketService,
    private basketItemService: BasketitemService, private communicationService: CommunicationService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    if (localStorage.getItem("id") != null) {
      this.Getcurruser();
      this.getCurrentBasket();
    }
  }

  ngOnDestroy(): void {
    this.postfav$.unsubscribe();
    this.deletefav$.unsubscribe();
    this.favs$.unsubscribe();
    this.basket$.unsubscribe();
    this.postBasketItem$.unsubscribe();
    this.putBasketItem$.unsubscribe();
    this.basketItems$.unsubscribe();
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
          // If this article-component is part of Favorites page
          if (this.isPartOfMyFavorites) {
            this.deleteFavorite.emit();
          }
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
      this.basket = results.filter(b => b.customerId === this.currentUsr.customerId && b.status === 0)[0];

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
