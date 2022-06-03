import { NgModule } from '@angular/core';
import { ArticleComponent } from './article.component';
import { ArticledetailComponent } from './articledetail/articledetail.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    ArticleComponent,
    ArticledetailComponent
  ],
  exports: [
    ArticleComponent,
    ArticledetailComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ArticleModule { }
