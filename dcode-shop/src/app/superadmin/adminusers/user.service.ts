import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {

  }

  baseurl: string = GlobalConstants.apiURL+"api";
  //baseurl: string = GlobalConstants.apiURL_local+"api";

  GetHeaders(): HttpHeaders{
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>( this.baseurl + "/users", { headers: this.GetHeaders()})
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(this.baseurl + "/users/" + id, { headers: this.GetHeaders()})
  }

  postUser(usr: User): Observable<User> {


    return this.httpClient.post<User>(this.baseurl + "/users", usr, { headers: this.GetHeaders()});
  }

  putUser(id: number, usr: User): Observable<User> {

    return this.httpClient.put<User>(this.baseurl + "/users/" + id, usr, { headers: this.GetHeaders()});
  }

  deleteUser(id: number): Observable<User> {
    return this.httpClient.delete<User>(this.baseurl + "/users/" + id, { headers: this.GetHeaders()});
  }
}
