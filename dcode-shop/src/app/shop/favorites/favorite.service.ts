import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/security/user';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Favorite } from './favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private httpClient: HttpClient) {

  }

  baseurl: string = GlobalConstants.apiURL+"api";
  //baseurl: string = GlobalConstants.apiURL_local+"api";

  GetHeaders(): HttpHeaders{
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  getFavs(custid:number): Observable<Favorite[]> {
    return this.httpClient.get<Favorite[]>( this.baseurl + "/favourites?CustomerId="+custid, { headers: this.GetHeaders()})
  }

  GetFavById(id: number): Observable<Favorite> {
    return this.httpClient.get<Favorite>(this.baseurl + "/favourites/" + id, { headers: this.GetHeaders()})
  }

  postFav(fav: Favorite): Observable<Favorite> {
    return this.httpClient.post<Favorite>(this.baseurl + "/favourites", fav, { headers: this.GetHeaders()});
  }

  putFav(id: number, fav: Favorite): Observable<Favorite> {

    return this.httpClient.put<Favorite>(this.baseurl + "/favourites/" + id, fav, { headers: this.GetHeaders()});
  }

  deleteFav(id: number): Observable<Favorite> {
    return this.httpClient.delete<Favorite>(this.baseurl + "/favourites/" + id, { headers: this.GetHeaders()});
  }
}
