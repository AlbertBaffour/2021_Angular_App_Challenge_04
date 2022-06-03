import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Article } from 'src/app/admin/adminarticle/article';
import { ArticleService } from 'src/app/shared/article.service';
import { Favorite } from '../favorite';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  @Input() currentFav!: Favorite;

  prod$ : Subscription = new Subscription();
  article: Article | undefined;

  @Output("GetUserFavs") GetUserFavs: EventEmitter<string> = new EventEmitter();

  constructor(private artservice:ArticleService) { }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(){
    this.prod$ = this.artservice.getArticleById(this.currentFav.productId).subscribe(
      result => {
        this.article = result.data;
      }
    );
  }

  deleteFavorite(){
    this.GetUserFavs.emit();
  }
}
