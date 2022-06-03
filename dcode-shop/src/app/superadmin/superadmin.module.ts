import { NgModule } from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import { AdminusersModule } from './adminusers/adminusers.module';
import { SuperadminRoutingModule } from './superadmin-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    SuperadminRoutingModule
  ],exports:[AdminusersModule]
})
export class SuperadminModule { }
