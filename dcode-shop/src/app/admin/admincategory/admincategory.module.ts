import { NgModule } from '@angular/core';
import { CategorylistComponent } from './categorylist/categorylist.component';
import { CategoryformComponent } from './categoryform/categoryform.component';
import {SharedModule} from "../../shared/shared.module";
import { CategoryService } from 'src/app/shared/category.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityInterceptor } from 'src/app/security/security.interceptor';


@NgModule({
  declarations: [
    CategoryformComponent,
    CategorylistComponent
  ],
  exports:[
    CategoryformComponent,
    CategorylistComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    CategoryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    }
  ]
})
export class AdmincategoryModule { }
