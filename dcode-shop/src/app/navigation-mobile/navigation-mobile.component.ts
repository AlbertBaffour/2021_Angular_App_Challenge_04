import { Component, OnInit } from '@angular/core';
import {Category} from "../admin/admincategory/category";
import {Subscription} from "rxjs";
import {CategoryService} from "../shared/category.service";
import {LoadingService} from "../shared/loading/loading.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-mobile',
  templateUrl: './navigation-mobile.component.html',
  styleUrls: ['./navigation-mobile.component.scss']
})
export class NavigationMobileComponent implements OnInit {

  categories: Category[] = [];
  categories$: Subscription = new Subscription();
  loading$ = this.loader.loading$;

  searchText: string = "";

  constructor(private router: Router, private loader: LoadingService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.loader.show()
    this.categories$ = this.categoryService.getCategories().subscribe(result => {
      this.categories = result;
      this.loader.hide();
    })
  }

  onSearchSubmit() {
    this.router.navigate(['shop'], {state: {search: this.searchText}});
  }
}
