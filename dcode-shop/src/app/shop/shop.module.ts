import {NgModule} from '@angular/core';
import {ShopComponent} from './shop.component';
import {SharedModule} from "../shared/shared.module";
import {FilterComponent} from "./filter/filter.component";
import {FavoritesComponent} from "./favorites/favorites.component";
import {ArticleModule} from "./article/article.module";
import {BasketModule} from "./basket/basket.module";
import { CheckoutComponent } from './checkout/checkout.component';
import { FavoriteComponent } from './favorites/favorite/favorite.component';
import { OrdersComponent } from './orders/orders.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityInterceptor } from '../security/security.interceptor';
import { BasketService } from './basket/basket.service';
import { ArticleService } from '../shared/article.service';
import { ShopheaderComponent } from './shopheader/shopheader.component';
import { SearchFilterPipe } from '../shared/search-filter.pipe';
import { CommunicationService } from '../shared/communication.service';
import { OverviewitemComponent } from './checkout/overviewitem/overviewitem.component';

@NgModule({
  declarations: [
    ShopComponent,
    FilterComponent,
    FavoritesComponent,
    CheckoutComponent,
    FavoriteComponent,
    OrdersComponent,
    ShopheaderComponent,
    OverviewitemComponent
  ],
  exports: [
    ShopComponent,
    FilterComponent,
    FavoritesComponent,
    CheckoutComponent,
    FavoriteComponent,
    OrdersComponent,
    ShopheaderComponent
  ],
  imports: [
    SharedModule,
    ArticleModule,
    BasketModule
  ],
  providers: [
    BasketService,
    ArticleService,
    SearchFilterPipe,
    CommunicationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    }
  ]
})
export class ShopModule {
}
