import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../admin/adminarticle/article';
import { ArticleService } from '../shared/article.service';
import { CommunicationService } from '../shared/communication.service';
import { SearchFilterPipe } from '../shared/search-filter.pipe';
import {AuthService} from "../security/auth.service";
import {BasketService} from "../shop/basket/basket.service";
import {User} from "../security/user";
import {Customer} from "../admin/customer";
import {LoadingService} from "../shared/loading/loading.service";
import {CustomerService} from "../superadmin/adminusers/customer.service";
import {Basket} from "../shop/basket/basket";
import {CategoryService} from "../shared/category.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchText = "";

  // Recommended items
  articles: Article[] = [];
  articles$: Subscription = new Subscription();
  currentCustomer$: Subscription = new Subscription();
  currentCustomerId: number = 0;
  categories$ : Subscription = new Subscription();
  sortByList: string[] = ["name","brand", "price"];
  orderByList: string[] = ["asc", "desc"];
  loading$ = this.loader.loading$;

  constructor(private loader: LoadingService, private router: Router, private articleService: ArticleService, private authService: AuthService, private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.loader.show();
    if(this.authService.isLoggedIn()){
      this.getCurrentCustomerId();
      this.getRecommendedItems();
    }
    else{
      this.getRandomArticles();
    }
  }

  onSearchSubmit() {
    this.router.navigate(['shop'], { state: { search: this.searchText } });
  }

  getRandomArticles(){
    this.articles$ = this.articleService.getArticles(this.sortByList[Math.floor(Math.random() * this.sortByList.length)], this.orderByList[Math.floor(Math.random() * this.orderByList.length)]).subscribe(result => {
      this.articles = result.data;
      if (result.data.length > 4){
        this.articles.splice(0, 4)
      }
      this.loader.hide();
    });
  }

  getCurrentCustomerId() {
    let usr = this.authService.getUser();
    if (usr != null) {
      this.currentCustomerId = usr.customerId;
    }
  }

  getRecommendedItems(){
    this.categories$ = this.categoryService.getRecommendedCategories(this.currentCustomerId).subscribe(result => {
      if (result.length > 0){
        this.articles$ = this.categoryService.getCategoryById(result[0], this.sortByList[Math.floor(Math.random() * this.sortByList.length)], this.orderByList[Math.floor(Math.random() * this.orderByList.length)]).subscribe(result => {
          this.articles = result.data.splice(0, 4);
          this.loader.hide();
        });
      }else{
        this.getRandomArticles();
      }
    });
  }

  ngOnDestroy(){
    this.articles$.unsubscribe();
    this.currentCustomer$.unsubscribe();
    this.categories$.unsubscribe();
  }
}
