import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Customer } from 'src/app/admin/customer';
import { EDService } from '../ed.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CommunicationService } from 'src/app/shared/communication.service';
import { Basket } from 'src/app/shop/basket/basket';
import { Subscription } from 'rxjs';
import { BasketService } from 'src/app/shop/basket/basket.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit, OnDestroy {

  CE = localStorage.getItem('email');
  user: User = {
    id: 0, email: this.CE != null ? this.CE : '', password: '', token: '',
    isActive: false,
    isAdmin: false,
    isSuperAdmin: false,
    customerId: 0
  };
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
  isSubmitted: boolean = false;
  errorMessage: string = '';

  isLogin: boolean = false;
  isRegister: boolean = false;
  isLogout: boolean = false;

  postBasket$: Subscription = new Subscription();
  basket$: Subscription = new Subscription();

  constructor(private authService: AuthService, private edService: EDService, private router: Router, private basketService: BasketService, private communicationService: CommunicationService) {

  }

  ngOnInit(): void {
    switch (this.router.url) {
      case '/login': {
        this.isLogin = true;
        break;
      }
      case '/logout': {
        this.isLogout = true;
        this.authService.logout();
        this.router.navigate(['']);
        break;
      }
      case '/register': {
        this.isRegister = true;
        break;
      }
      default: {
        this.isLogin = true;
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.postBasket$.unsubscribe();
    this.basket$.unsubscribe();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.isLogin) {
      this.authService.authenticate(this.user.email, this.edService.encrypt(this.user.password), 'user').subscribe(result => {
        this.errorMessage = '';
        this.authService.login(result);
        this.getUser();
      }, error => {
        this.errorMessage = error.status == 0 ? 'Slechte verbinding... probeer de pagina opnieuw te laden!' : 'Email of wachtwoord is onjuist!';
        this.isSubmitted = false;
      });
    } else {
      if (this.isRegister) {
        // een customer aanmaken
        this.customer.email = this.user.email
        this.authService.registerCustomer(this.customer).subscribe(result => {
          this.errorMessage = '';
          // Een user accoutn aanmkaen voor de customer
          this.authService.registerUser(result.id, this.user.email, this.edService.encrypt(this.user.password), this.customer.firstName, this.customer.lastName, true).subscribe(result => {
            localStorage.setItem('email', this.user.email);

            this.router.navigate(['/login']);
          }, error => {
            this.errorMessage = 'Gebruiker aanmaken mislukt';
          });
        }, error => {
          this.errorMessage = error.status == 409 ? 'Er bestaat al een gebruiker met dit emailadres :(' : 'Account aanmaken mislukt ';

          this.isSubmitted = false;
        });
      }
    }
  }

  getUser() {
    let usr = this.authService.getUser();
    if (usr != null) {
      this.user = usr;
    }

    // Check of customer al een basket heeft of nog niet (net geregistreerde user)
    this.checkForBasket();
  }

  checkForBasket() {
    this.basket$ = this.basketService.getBaskets().subscribe(results => {
      let basket = results.filter(b => b.customerId === this.user.customerId && b.status === 0)[0];

      // Als customer nog geen basket heeft
      if (!basket) {
        // Basket aanmaken voor de customer
        this.createBasket();
      }
      else {
        // Update basket size in navbar naar basketSize van ingelogde user
        this.communicationService.updateNavBasketSize();

        this.router.navigate(['']);
      }
    });
  }


  createBasket() {
    let newBasket: Basket = { id: 0, customerId: this.user.customerId, orderDate: new Date(), deliveryDate: new Date(), status: 0, totalPrice: 0, orderProducts: [] };

    this.postBasket$ = this.basketService.postBasket(newBasket).subscribe(result => {
      // Update basket size in navbar naar basketSize van ingelogde user
      this.communicationService.updateNavBasketSize();

      this.router.navigate(['']);
    });
  }

}
