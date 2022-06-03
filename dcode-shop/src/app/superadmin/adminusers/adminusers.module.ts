import { NgModule } from '@angular/core';
import { UserlistComponent } from './userlist/userlist.component';
import { UserformComponent } from './userform/userform.component';
import {UserService} from "./user.service";
import {SharedModule} from "../../shared/shared.module";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityInterceptor } from 'src/app/security/security.interceptor';



@NgModule({
  declarations: [
    UserlistComponent,
    UserformComponent
  ],
  exports: [
    UserlistComponent,
    UserformComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    UserService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: SecurityInterceptor,
        multi: true
      }
  ]
})
export class AdminusersModule { }
