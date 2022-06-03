import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/admin/customer';

import { CustomerService } from '../customer.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss']
})
export class UserformComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
  }

  isAdd: boolean = false;
  isEdit: boolean = false;
  userId: number = 0;
  customer: Customer = {
    id: 0,
    firstName: '',
    lastName: '',
    streetAndNumber: '',
    postcode: '',
    city: '',
    phone: '',
    email: '',
    orders: [],
    userId: 0
  };
  user: User = {id : 0, firstName : "", lastName: "", email : "", isActive : true, isSuperAdmin : false, isAdmin : false, password:"abc123", token:"", customerId:0, customer : this.customer};
  isSubmitted: boolean = false;
  errorMessage: string = "";
  user$: Subscription = new Subscription();
  postUser$: Subscription = new Subscription();
  putUser$: Subscription = new Subscription();
  postCustomer$: Subscription = new Subscription();
  putCustomer$: Subscription = new Subscription();


  constructor(private router: Router, private userservice: UserService, private customerservice: CustomerService, private toastrService: ToastrService) {
    this.isAdd = this.router.getCurrentNavigation()?.extras.state?.mode === 'add';
    this.isEdit = this.router.getCurrentNavigation()?.extras.state?.mode === 'edit';
    this.userId = +this.router.getCurrentNavigation()?.extras.state?.id;

    //only get list when editing
    if (this.userId != null && this.userId > 0) {
      this.user$ = this.userservice.getUserById(this.userId).subscribe(result =>{
        this.user = result;
        this.customer = this.user.customer;
      } );
    }
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
    this.postUser$.unsubscribe();
    this.putUser$.unsubscribe();
  }

  onSubmit() {
    this.isSubmitted = true;

    this.customer.firstName = this.user.firstName;
    this.customer.lastName = this.user.lastName;
    this.customer.email = this.user.email;

    //Add new user
    if (this.isAdd) {
      this.user.customer = this.customer;
      this.postUser$ = this.userservice.postUser(this.user).subscribe(result => {
        this.showToasterSuccess();
        this.router.navigateByUrl("superadmin/users");
      },
        error => {
          this.errorMessage = error.message;
          this.showToasterError();
        });
    }

    //Edit existing user
    if (this.isEdit) {
      this.putCustomer$ = this.customerservice.putCustomer(this.customer.id, this.customer).subscribe(result => {
        this.putUser$ = this.userservice.putUser(this.userId, this.user).subscribe(result => {
          this.router.navigateByUrl("superadmin/users");
          this.showToasterSuccessEdit();
        },
          error => {
            this.errorMessage = error.message;
          });
      });
    }
  }
  showToasterSuccess(){
    this.toastrService.success("Nieuwe gebruiker succesvol aangemaakt.")
  }

  showToasterSuccessEdit() {
    this.toastrService.success("Wijzigingen in gebruiker opgeslagen.")
  }

  showToasterError(){
    this.toastrService.error("Er is iets misgegaan. Probeer later opnieuw.")
  }

}
