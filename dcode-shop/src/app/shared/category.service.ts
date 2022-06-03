import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../admin/admincategory/category";
import { GlobalConstants } from './global-constants';
import {CategoryResponse} from "./response/category-response";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }


  getCategoryById(id: number, sortBy: string, orderBy: string, brands: string="" , priceLow:number=0,priceHigh:number=0,inStock:number=1): Observable<CategoryResponse> {
     return this.httpClient.get<CategoryResponse>(GlobalConstants.apiURL+"api/categories/" + id + "?sortBy=" + sortBy+ "&sortDirection=" + orderBy +"&brands="+brands+"&priceLow="+(priceLow==null?0:priceLow)+"&priceHigh="+(priceHigh==null?0:priceHigh)+"&inStock="+inStock);
  }

  getCategoryByIdByPage(id: number, page: string, sortBy: string, orderBy: string, brands: string="" , priceLow:number=0,priceHigh:number=0,inStock:number=1): Observable<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(page + "&sortBy=" + sortBy + "&sortDirection=" + orderBy+"&brands="+brands+"&priceLow="+(priceLow==null?0:priceLow)+"&priceHigh="+(priceHigh==null?0:priceHigh)+"&inStock="+inStock);

  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(GlobalConstants.apiURL+"api/categories");
  }

  getRecommendedCategories(customerId: number): Observable<number[]> {
    return this.httpClient.get<number[]>(GlobalConstants.apiURL+"api/categories/Recent/" + customerId);
  }
}
