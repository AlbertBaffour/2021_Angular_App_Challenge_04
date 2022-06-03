import { NgModule } from '@angular/core';
import { ArticlelistComponent } from './articlelist/articlelist.component';
import { ArticleformComponent } from './articleform/articleform.component';
import {SharedModule} from "../../shared/shared.module";
import { AdminarticleService } from './adminarticle.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityInterceptor } from 'src/app/security/security.interceptor';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    ArticlelistComponent,
    ArticleformComponent
  ],
  exports:[
    ArticlelistComponent,
    ArticleformComponent
  ],
  imports: [
    SharedModule,
    ToastrModule
  ],
  providers: [
    AdminarticleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    }
  ]
})
export class AdminarticleModule { }
