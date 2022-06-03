import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Basket } from './basket';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private httpClient: HttpClient) {
  }

  getBaskets(): Observable<Basket[]> {
    return this.httpClient.get<Basket[]>(GlobalConstants.apiURL + "api/orders");
  }

  getBasketById(id: number): Observable<Basket> {
    return this.httpClient.get<Basket>(GlobalConstants.apiURL + "api/orders/" + id);
  }

  putBasket(id: number, basket: Basket): Observable<Basket> {
    return this.httpClient.put<Basket>(GlobalConstants.apiURL + "api/orders/" + id, basket);
  }

  postBasket(basket: Basket): Observable<Basket> {
    return this.httpClient.post<Basket>(GlobalConstants.apiURL + "api/orders", basket);
  }
}
