import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { Article } from 'src/app/admin/adminarticle/article';
import { ArticlesResponse } from 'src/app/shared/response/articles-response';
import { ArticleResponse } from './response/article-response';
import { GlobalConstants } from './global-constants';
import { SearchFilterPipe } from './search-filter.pipe';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private httpClient: HttpClient, private searchFilterPipe: SearchFilterPipe) { }

  getArticlesAdmin(): Observable<Article[]> {
    return this.httpClient.get<Article[]>(GlobalConstants.apiURL+"api/products/admin");
  }
  getArticles(sortBy: string, orderBy: string, brands: string="" , priceLow:number=0,priceHigh:number=0,inStock:number=1): Observable<ArticlesResponse> {
    return this.httpClient.get<ArticlesResponse>(GlobalConstants.apiURL+"api/products" + "?sortBy=" + sortBy + "&sortDirection=" + orderBy+"&brands="+brands+"&priceLow="+(priceLow==null?0:priceLow)+"&priceHigh="+(priceHigh==null?0:priceHigh)+"&inStock="+inStock);
  }

  getSearchedArticles(sortBy: string, orderBy: string, filter: Article): Observable<ArticlesResponse> {
    return this.httpClient.get<ArticlesResponse>(GlobalConstants.apiURL+"api/products/all");
  }

  getArticlesByPage(page: string, sortBy: string, orderBy: string , brands: string="" , priceLow:number=0,priceHigh:number=0,inStock:number=1): Observable<ArticlesResponse> {
    return this.httpClient.get<ArticlesResponse>(page + "&sortBy=" + sortBy + "&sortDirection=" + orderBy+"&brands="+brands+"&priceLow="+(priceLow==null?0:priceLow)+"&priceHigh="+(priceHigh==null?0:priceHigh)+"&inStock="+inStock);
  }

  getArticleById(id: number): Observable<ArticleResponse> {
    return this.httpClient.get<ArticleResponse>(GlobalConstants.apiURL+"api/products/" + id);
  }
  getAllBrands(): Observable<string[]> {
    return this.httpClient.get<string[]>(GlobalConstants.apiURL+"api/products/Brands");
  }

  postArticle(article: Article): Observable<Article> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.httpClient.post<Article>(GlobalConstants.apiURL+"api/products", article, {headers: headers});
  }

  updateArticle(id: number, article: Article): Observable<Article> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.httpClient.put<Article>(GlobalConstants.apiURL+"api/products/" + id, article, {headers: headers});
  }

  deleteArticle(id: number): Observable<Article> {
    return this.httpClient.delete<Article>(GlobalConstants.apiURL+"api/products/" + id);
  }



}
