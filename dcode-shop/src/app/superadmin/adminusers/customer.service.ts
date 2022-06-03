import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/admin/customer';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) {

  }

  baseurl: string = GlobalConstants.apiURL+"api";
//baseurl: string = GlobalConstants.apiURL_local+"api";

  GetHeaders(): HttpHeaders{
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }


  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>( this.baseurl + "/customers", { headers: this.GetHeaders()})
  }

  getCustById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(this.baseurl + "/customers/" + id, { headers: this.GetHeaders()})
  }

  postCustomer(cust: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.baseurl + "/customers", cust, { headers: this.GetHeaders()});
  }

  putCustomer(id: number, cust: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(this.baseurl + "/customers/" + id, cust, { headers: this.GetHeaders()});
  }

  deleteCustomer(id: number): Observable<Customer> {
    return this.httpClient.delete<Customer>(this.baseurl + "/customers/" + id, { headers: this.GetHeaders()});
  }
}
