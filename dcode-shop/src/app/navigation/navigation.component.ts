import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from "../admin/admincategory/category";
import {CategoryService} from "../shared/category.service";
import {AuthService} from '../security/auth.service';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import { BasketService } from '../shop/basket/basket.service';
import { BasketitemService } from '../shop/basket/basketitem/basketitem.service';
import { CommunicationService } from '../shared/communication.service';
import {Article} from "../admin/adminarticle/article";
import {LoadingService} from "../shared/loading/loading.service";
import { User } from '../security/user';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  @Output() toggleNav =  new EventEmitter<{toggled: boolean}>();

  searchText = "";
  navToggled: boolean = false;
  articles: Article[] = [];
  articles$: Subscription = new Subscription();

  categories: Category[] = [];
  categories$ : Subscription = new Subscription();
  selectedCategoryId : number = 0;

  basket$: Subscription = new Subscription();
  basketSize = 0;

  loading$ = this.loader.loading$;

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

  constructor(private loader: LoadingService, private categoryService: CategoryService, private basketService: BasketService, private basketItemService: BasketitemService, public authService: AuthService, private router: Router, private communicationService: CommunicationService) {
    this.communicationService.updateNavBasketSize$.subscribe(() => {
        this.getBasketSize();
      }
    );
  }

  ngOnInit(): void {
    // Get categories

    this.getCategories();

    // Refresh content of page even if navigating to same page
    // => search results get refreshed
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  toggleNavigation(){
    this.navToggled = !this.navToggled;
    this.toggleNav.emit({toggled: this.navToggled});
  }

  closeNavigation(){
    this.navToggled = false;
    this.toggleNav.emit({toggled: this.navToggled});
  }

  showAll(){
    this.router.navigate(['shop']);
    this.closeNavigation();
  }

  selectCategoryId(id: number){
    this.articles = [];
    this.loader.show();
    this.selectedCategoryId = id;
    this.articles$ = this.categoryService.getCategoryById(id, "", "").subscribe(results => {
      this.articles = results.data.slice(0,4);
      this.loader.hide();
    });
  }

  onSearchSubmit() {
    this.closeNavigation();
    this.router.navigate(['shop'], {state: {search: this.searchText}});
  }

  navigateCategory(category: number) {
    this.closeNavigation();
    this.router.navigate(['/shop']).then(() => {
      this.router.navigate(['/shop/category', category]).then();
    });
  }

  getCategories() {
    this.categories$ = this.categoryService.getCategories().subscribe(results => {
      this.categories = results;
    });
  }

  getBasketSize() {
    this.getcurruser();

    this.basket$ = this.basketService.getBaskets().subscribe(results => {
      let basket = results.filter(b => b.customerId === this.currentUsr.customerId && b.status === 0)[0];
      this.basketItemService.getBasketItems().subscribe(result => {
        this.basketSize = result.filter(i => i.orderId === basket.id).length;
      });
    });
  }

  getcurruser() {
    let usr = this.authService.getUser();
    if (usr != null) {
      this.currentUsr = usr;
    }
  }

  ngOnDestroy() {
    // Turn off same-page refresh
    this.router.routeReuseStrategy.shouldReuseRoute = () => true;
    this.router.onSameUrlNavigation = 'ignore';
  }
}
