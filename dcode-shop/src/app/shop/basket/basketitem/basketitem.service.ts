import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { BasketItem } from './basketitem';

@Injectable({
  providedIn: 'root'
})
export class BasketitemService {

  constructor(private httpClient: HttpClient) {
  }

  getBasketItems(): Observable<BasketItem[]> {
    return this.httpClient.get<BasketItem[]>(GlobalConstants.apiURL + "api/orderProducts");
  }

  getBasketItemById(id: number): Observable<BasketItem> {
    return this.httpClient.get<BasketItem>(GlobalConstants.apiURL + "api/orderProducts/" + id);
  }

  putBasketItem(id: number, basketItem: BasketItem): Observable<BasketItem> {
    return this.httpClient.put<BasketItem>(GlobalConstants.apiURL + "api/orderProducts/" + id, basketItem);
  }

  postBasketItem(basketItem: BasketItem) {
    return this.httpClient.post<BasketItem>(GlobalConstants.apiURL + "api/orderProducts", basketItem);
  }

  deleteBasketItem(id: number) {
    return this.httpClient.delete<BasketItem>(GlobalConstants.apiURL + "api/orderProducts/" + id);
  }
}
