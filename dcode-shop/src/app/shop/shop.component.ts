import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../admin/adminarticle/article';
import { ArticleService } from '../shared/article.service';
import { ActivatedRoute } from "@angular/router";
import { PaginationHeaders } from "../shared/response/pagination-headers";
import { CategoryService } from "../shared/category.service";
import { LoadingService } from "../shared/loading/loading.service";
import { Category } from "../admin/admincategory/category";
import { SearchFilterPipe } from '../shared/search-filter.pipe';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  searchText = "";

  filter: Article = { id: 0, name: "", color: '', price: 0, isActive: false, description: "", categoryId: 1, quantityInStock: 0, brand: "", img: "", size: 0 };

  headers: PaginationHeaders = { pageNumber: 0, firstPage: "", lastPage: "", nextPage: "", pageSize: 0, previousPage: "", totalPages: 0, totalRecords: 0 };

  articles: Article[] = [];
  articles$: Subscription = new Subscription();

  selectedCategory: Category = { id: 0, name: "", description: "" };
  loading$ = this.loader.loading$;

  // Sort + pagination
  page: string = "";
  sort: string = "name";
  order: string = "asc";
  priceLow:number=0;
  priceHigh:number=0;
  brands:string="";
  inStock:number=1;

  constructor(private loader: LoadingService, private articleService: ArticleService, private categoryService: CategoryService, private router: Router, private route: ActivatedRoute, private searchpipe: SearchFilterPipe) {
    this.searchText = this.router.getCurrentNavigation()?.extras.state?.search;
    if (this.searchText) {
      this.filter.name = this.searchText;
      this.filter.brand = this.searchText;
      this.filter.description = this.searchText;
    }
  }

  ngOnInit(): void {
    this.loader.show();
    const category = this.route.snapshot.paramMap.get('category');
    if (category) {
      // Get articles from this category;
      this.articles$ = this.categoryService.getCategoryById(+category, this.sort, this.order).subscribe(results => {
        this.selectedCategory = results.category;
        this.setResults(results);
      });
    }

    else if (this.searchText) {
      // Get all articles
      this.articles$ = this.articleService.getSearchedArticles(this.sort, this.order, this.filter).subscribe(results => {
        this.selectedCategory.name = "Zoekresultaten";
        results = this.searchpipe.transform(results, this.filter);
        this.setResults(results);
      });
    }

    else {
      // Get all articles
      this.articles$ = this.articleService.getArticles(this.sort, this.order).subscribe(results => {
        this.selectedCategory.name = "Alle Artikelen";
        this.setResults(results);
      });
    }
  }

  getArticles(page: string, sort: string, order: string, selectedBrands:string[]=[] ,priceLow:number=0,priceHigh:number=0,inStock:number=1 ) {

    let brands= selectedBrands.length>=1?selectedBrands[0]:""
    for(let i=1;i<selectedBrands.length;i++){
      brands=brands+'%'+selectedBrands[i]
    }

    // 'Alle artikelen'
    this.articles = [];
    this.loader.show();
    if (this.selectedCategory.name == "Alle Artikelen") {
      // Paginate
      if (sort == "pass" && order == "pass") {
        this.articles$ = this.articleService.getArticlesByPage(page, this.sort, this.order, brands ,priceLow,priceHigh,inStock).subscribe(results => {
          this.setResults(results);
        });
      }

      // Sort
      else {
        this.sort = sort;
        this.order = order;
        this.articles$ = this.articleService.getArticles(sort, order,brands,priceLow,priceHigh,inStock).subscribe(results => {
          this.setResults(results);
        });
      }
    }
    // Articles by category
    else {
      // Paginate
      if (sort == "pass" && order == "pass") {
        this.articles$ = this.categoryService.getCategoryByIdByPage(this.selectedCategory.id, page, this.sort, this.order,brands,priceLow,priceHigh,inStock).subscribe(results => {
          this.setResults(results);
        });
      }

      // Sort
      else {
        this.sort = sort;
        this.order = order;
        this.brands=brands;
        this.priceLow=priceLow;
        this.priceHigh=priceHigh;
        this.inStock=inStock
        this.articles$ = this.categoryService.getCategoryById(this.selectedCategory.id, sort, order, brands,priceLow,priceHigh,inStock).subscribe(results => {
          this.setResults(results);
        });
      }
    }
  }

  setResults(results: any) {

    if(!this.searchText){
      this.headers.totalRecords = results.totalRecords;
      this.headers.totalPages = results.totalPages;
      this.headers.previousPage = results.previousPage;
      this.headers.pageSize = results.pageSize;
      this.headers.nextPage = results.nextPage;
      this.headers.lastPage = results.lastPage;
      this.headers.firstPage = results.firstPage;
      this.headers.pageNumber = results.pageNumber;
      this.articles = results.data;
    }
    else{
      this.headers.totalRecords = results.length;
      this.articles = results;
    }
    this.loader.hide();
  }


  ngOnDestroy(): void {
    this.articles$.unsubscribe();
  }
}
