import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { UserformComponent } from './adminusers/userform/userform.component';
import { UserlistComponent } from './adminusers/userlist/userlist.component';


const routes: Routes = [
  {path: "users", component: UserlistComponent},
  {path: "users/form", component: UserformComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule {
}
