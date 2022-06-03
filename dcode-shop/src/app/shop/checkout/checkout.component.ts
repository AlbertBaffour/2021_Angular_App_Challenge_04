import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/admin/adminarticle/article';
import { ArticleService } from 'src/app/shared/article.service';
import { CommunicationService } from 'src/app/shared/communication.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { BasketItem } from '../basket/basketitem/basketitem';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  baseImgUrl=GlobalConstants.baseImgUrl;
  mode="";

  basketItems: BasketItem[] = [];


  constructor(private router: Router, private artservice:ArticleService, private communicationService: CommunicationService) {
    this.mode = this.router.getCurrentNavigation()?.extras.state?.mode;
    this.basketItems =  this.router.getCurrentNavigation()?.extras.state?.OrderItems;
   }

  ngOnInit(): void {
    // Update basket size in navbar
    this.communicationService.updateNavBasketSize();
  }


}
