import { NgModule } from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {AdminarticleModule} from "./adminarticle/adminarticle.module";
import {AdminRoutingModule} from './admin-routing.module';
import {AdminorderModule} from "./adminorder/adminorder.module";
@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    AdminarticleModule,
    AdminorderModule,
    AdminRoutingModule,
  ],exports:[
    AdminarticleModule,
    AdminorderModule
  ]
})
export class AdminModule { }
