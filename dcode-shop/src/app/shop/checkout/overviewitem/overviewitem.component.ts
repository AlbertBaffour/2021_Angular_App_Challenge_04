import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/admin/adminarticle/article';
import { ArticleService } from 'src/app/shared/article.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { BasketItem } from '../../basket/basketitem/basketitem';

@Component({
  selector: 'app-overviewitem',
  templateUrl: './overviewitem.component.html',
  styleUrls: ['./overviewitem.component.scss']
})
export class OverviewitemComponent implements OnInit {

  @Input() currentItem = { id: 0, productId: 0, orderId: 0, quantity: 0, currentPrice: 0, subtotal: 0 };

  baseImgUrl=GlobalConstants.baseImgUrl;
  article$ : Subscription = new Subscription();

  currentArticle: Article = {
    id: 0,
    brand: '',
    name: '',
    price: 0,
    color: '',
    description: '',
    isActive: false,
    quantityInStock: 0,
    categoryId: 0,
    img: '',
    size: 0
  }

  constructor(private artservice: ArticleService) { }

  ngOnInit(): void {
    this.article$ = this.artservice.getArticleById(this.currentItem.productId).subscribe(result => {
        this.currentArticle = result.data;
    });
  }

}
