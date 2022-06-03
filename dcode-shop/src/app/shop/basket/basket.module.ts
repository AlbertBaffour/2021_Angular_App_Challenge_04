import { NgModule } from '@angular/core';
import { BasketitemComponent } from './basketitem/basketitem.component';
import {BasketComponent} from "./basket.component";
import {SharedModule} from "../../shared/shared.module";
import { DatePipe } from '@angular/common';
import { BasketService } from './basket.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityInterceptor } from 'src/app/security/security.interceptor';



@NgModule({
  declarations: [
    BasketComponent,
    BasketitemComponent
  ],
  exports: [
    BasketComponent,
    BasketitemComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    DatePipe,
    Location,
    BasketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    }
  ]
})
export class BasketModule { }
