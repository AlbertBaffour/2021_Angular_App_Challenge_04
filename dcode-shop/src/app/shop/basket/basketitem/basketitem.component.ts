import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/admin/adminarticle/article';
import { ArticleService } from 'src/app/shared/article.service';
import { CommunicationService } from 'src/app/shared/communication.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { BasketitemService } from './basketitem.service';

@Component({
  selector: 'app-basketitem',
  templateUrl: './basketitem.component.html',
  styleUrls: ['./basketitem.component.scss']
})
export class BasketitemComponent implements OnInit, OnDestroy {
baseImgUrl=GlobalConstants.baseImgUrl;
  @Input() mode = "";
  @Input() basketItem = { id: 0, productId: 0, orderId: 0, quantity: 0, currentPrice: 0, subtotal: 0 };

  @Output() onQuantityChanged = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  article$: Subscription = new Subscription();
  article: Article = {
    id: 0, categoryId: 0, name: "", brand: "", price: 0, description: "", isActive: true, quantityInStock: 0, img: "", size: 0,
    color: ''
  };

  putBasketItem$: Subscription = new Subscription();
  deleteBasketItem$: Subscription = new Subscription();

  constructor(private articleService: ArticleService, private basketItemService: BasketitemService, private communicationService: CommunicationService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getArticleById(this.basketItem.productId);
  }

  ngOnDestroy(): void {
    this.article$.unsubscribe();
    this.putBasketItem$.unsubscribe();
    this.deleteBasketItem$.unsubscribe();
  }

  getArticleById(id: number) {
    this.article$ = this.articleService.getArticleById(id).subscribe(results => {
      this.article = results.data;
      this.basketItem.currentPrice = results.data.price;
    });
  }

  calculateSubtotal(price: number, quantity: number) {
    this.basketItem.subtotal = Math.round(price * quantity * 100) / 100;
    this.updateBasketItem();
  }

  changeQuantity(newQuantity: any) {
    if (newQuantity) {
      this.basketItem.quantity = newQuantity;
      this.calculateSubtotal(this.basketItem.currentPrice, newQuantity);
    }
  }

  updateBasketItem() {
    this.putBasketItem$ = this.basketItemService.putBasketItem(this.basketItem.id, this.basketItem).subscribe(result => {
      // Update basket component
      this.onQuantityChanged.emit();
    });
  }

  deleteBasketItem() {
    this.deleteBasketItem$ = this.basketItemService.deleteBasketItem(this.basketItem.id).subscribe(result => {
      // Update basket component
      this.onDelete.emit();

      // Update basket size in navbar
      this.communicationService.updateNavBasketSize();

      // Show toaster
      this.showToasterDeleteSuccess();
    });
  }

  showToasterDeleteSuccess() {
    this.toastrService.success("Artikel verwijderd uit uw winkelmandje!")
  }
}
