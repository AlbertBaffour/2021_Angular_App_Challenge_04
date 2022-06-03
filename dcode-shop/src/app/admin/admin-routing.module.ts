import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ArticleformComponent } from './adminarticle/articleform/articleform.component';
import { ArticlelistComponent } from './adminarticle/articlelist/articlelist.component';
import {OrderlistComponent} from "./adminorder/orderlist/orderlist.component";

const routes: Routes = [
  {path: "articles", component: ArticlelistComponent},
  {path: "articles/form", component: ArticleformComponent},
  {path: "articles/form/:id", component: ArticleformComponent},
  {path: "orders", component: OrderlistComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
