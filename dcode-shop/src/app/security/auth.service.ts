import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {Observable} from 'rxjs';
import {UserResponse} from './userResponse';
import { Customer } from '../admin/customer';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  getUser(): User | null {
    if (this.isLoggedIn()){
      return { id : parseInt(localStorage.getItem('id') ?? '0') ,
        email: localStorage.getItem('email') ?? '', password: '',
        isActive:localStorage.getItem('isActive')=='true',
        isAdmin:localStorage.getItem('isAdmin')=='true',
        isSuperAdmin:localStorage.getItem('isSuperAdmin')=='true',
        token: this.getToken(), customerId: parseInt(localStorage.getItem('customerId') ?? '0')   };
    } else {
      return null;
    }
  }
  getRole() {
    return localStorage.getItem('role');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role')
    localStorage.removeItem('customerId');
  }

  login(result:UserResponse){
    // save access token localstorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('id', result.id.toString());
    localStorage.setItem('email', result.email);
    localStorage.setItem('customerId', result.customerId.toString());
    result.isSuperAdmin?localStorage.setItem('role','superadmin'):(result.isAdmin?localStorage.setItem('role','admin'):'')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  authenticate(email: string,password:string, firstName:string): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(GlobalConstants.apiURL+'api/Users/authenticate', {email, password, firstName});
  }

  registerCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(GlobalConstants.apiURL+'api/Customers', customer);
  }
  registerUser(customerId:number, email: string,password:string, firstName:string, lastName:string ,isActive:boolean): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(GlobalConstants.apiURL+'api/Users', {firstName,lastName,email,password,isActive,customerId});
  }
}
