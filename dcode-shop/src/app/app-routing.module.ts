import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleformComponent } from './admin/adminarticle/articleform/articleform.component';
import { ArticlelistComponent } from './admin/adminarticle/articlelist/articlelist.component';
import { HomeComponent } from './home/home.component';
import {ShopComponent} from "./shop/shop.component";
import {ArticledetailComponent} from "./shop/article/articledetail/articledetail.component";
import {BasketComponent} from "./shop/basket/basket.component";
import {CheckoutComponent} from "./shop/checkout/checkout.component";
import {FavoritesComponent} from "./shop/favorites/favorites.component";

import { CategoryformComponent } from './admin/admincategory/categoryform/categoryform.component';
import { CategorylistComponent } from './admin/admincategory/categorylist/categorylist.component';

import { SecurityComponent } from './security/security/security.component';
import {AdminarticleModule} from "./admin/adminarticle/adminarticle.module";

import {UserlistComponent} from "./superadmin/adminusers/userlist/userlist.component";
import {UserformComponent} from "./superadmin/adminusers/userform/userform.component";

import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";
import { OrdersComponent } from './shop/orders/orders.component';
import { AuthGuard } from './security/auth.guard';
import {NavigationMobileComponent} from "./navigation-mobile/navigation-mobile.component";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileFormComponent } from './user-profile/user-profile-form/user-profile-form.component';
import {OrderlistComponent} from "./admin/adminorder/orderlist/orderlist.component";
import {OrderdetailComponent} from "./admin/adminorder/orderdetail/orderdetail.component";



const routes: Routes = [
  {path: "", component: HomeComponent},

  // Login
  {path: "login", component: SecurityComponent},
  {path: "register", component: SecurityComponent},
  {path: "logout", component: SecurityComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },

  // Shop
  {path: "shop", component: ShopComponent},
  {path: "shop/search/:search", component: ShopComponent},
  {path: "search", component: NavigationMobileComponent},

  {path: "shop/category/:category", component: ShopComponent},
  {path: "shop/:id", component: ArticledetailComponent},
  {path: "basket", component: BasketComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  {path: "checkout", component: CheckoutComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  {path: "orders", component: OrdersComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  {path: "orders/:id", component: BasketComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},

  // Favorites
  {path: "favorites", component: FavoritesComponent  ,canActivate: [AuthGuard], canActivateChild: [AuthGuard]},

  //User
  {path: "user", component: UserProfileComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  {path: "user/form", component: UserProfileFormComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},

  // Admin
 //alles van admin moet uiteindelijk 1 lijn worden => lazy loading
 // {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['admin','superadmin']}},
 {path: "admin/articles", component: ArticlelistComponent , canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['admin','superadmin']}},
 {path: "admin/articles/form", component: ArticleformComponent , canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['admin','superadmin']}},
 {path: "admin/articles/form/:id", component: ArticleformComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['admin','superadmin']}},
 {path: "admin/orders", component: OrderlistComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['admin','superadmin']}},
 {path: "admin/orders/:orderId", component: OrderdetailComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['admin','superadmin']}},

 //alles van superadmin moet uiteindelijk 1 lijn worden =>  lazy loading
 // {path: 'superadmin', loadChildren: () => import('./superadmin/superadmin.module').then(m => m.SuperadminModule), canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  {path: "superadmin/users", component: UserlistComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['superadmin']}},
  {path: "superadmin/users/form", component: UserformComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],data: {role:['superadmin']}},


  // 404
  { path: '**', pathMatch: 'full',
    component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
