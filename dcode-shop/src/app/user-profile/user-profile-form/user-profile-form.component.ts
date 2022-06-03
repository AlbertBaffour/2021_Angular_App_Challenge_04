import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/admin/customer';
import { AuthService } from 'src/app/security/auth.service';
import { CustomerService } from 'src/app/superadmin/adminusers/customer.service';
import { User } from 'src/app/superadmin/adminusers/user';
import { UserService } from 'src/app/superadmin/adminusers/user.service';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss']
})
export class UserProfileFormComponent implements OnInit {
  userId: number = 0;
  isAdd: boolean = false;
  isEdit: boolean = false;
  errorMessage: string = "";
  isSubmitted: boolean = false;
  user$: Subscription = new Subscription();
  putUser$: Subscription = new Subscription();
  putCustomer$: Subscription = new Subscription();
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

  constructor(private userservice: UserService, private customerservice: CustomerService, private router: Router, private authService: AuthService) {
    this.isEdit = this.router.getCurrentNavigation()?.extras.state?.mode === "edit";

    let usr = this.authService.getUser(); 
    let userid = usr?.id;
    if (userid != null && userid > 0) {
      this.user$ = this.userservice.getUserById(userid).subscribe(result => {
        this.user = result;
        this.customer = this.user.customer
      });
    }
   }

  ngOnInit(): void {
    
  }

  onSubmit() {
    this.isSubmitted = true;

    this.customer.firstName = this.user.firstName;
    this.customer.lastName = this.user.lastName;
    this.customer.email = this.user.email;

    //Edit existing user
    if (this.isEdit) {
      this.putCustomer$ = this.customerservice.putCustomer(this.customer.id, this.customer).subscribe(result => {
        this.putUser$ = this.userservice.putUser(this.user.id, this.user).subscribe(result => {
          this.router.navigateByUrl("user");
        },
          error => {
            this.errorMessage = error.message;
          });
      });
    }
  }

}
