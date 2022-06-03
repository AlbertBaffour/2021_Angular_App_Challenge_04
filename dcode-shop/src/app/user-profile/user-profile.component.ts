import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from '../admin/customer';
import { AuthService } from '../security/auth.service';
import { User } from '../security/user';
import { CustomerService } from '../superadmin/adminusers/customer.service';
import {LoadingService} from "../shared/loading/loading.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user$: Subscription = new Subscription();

  currentUsr: Customer = {
    id: 0,
    email: '',
    firstName: "",
    lastName: '',
    phone: '',
    streetAndNumber: "",
    postcode: "",
    city: '',
    orders: [],
    userId: 0
  };
  loading$ = this.loader.loading$;


  constructor(private loader: LoadingService, private authService: AuthService, private customerService: CustomerService, private router: Router) {
   }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  edit() {
    this.router.navigate(['user/form'], {state: {mode: "edit"}})
  }

  getCurrentUser() {
    this.loader.show();
    let user = this.authService.getUser();
    if (user != null) {
      this.user$ = this.customerService.getCustById(user.id).subscribe(result => {
        this.currentUsr = result;
        this.loader.hide();
      })
    }
  }
}
