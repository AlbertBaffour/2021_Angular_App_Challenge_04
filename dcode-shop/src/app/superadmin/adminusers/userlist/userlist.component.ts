import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CustomerService } from '../customer.service';
import { Customer } from 'src/app/admin/customer';
import { User } from '../user';
import { UserService } from '../user.service';
import {LoadingService} from "../../../shared/loading/loading.service";
import {LanguageApp} from "../../../shared/datatables/languages";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  users: User[] = []
  users$: Subscription = new Subscription();
  deleteUser$: Subscription = new Subscription();
  deleteCust$: Subscription = new Subscription();

  loading$ = this.loader.loading$;
  dtOptions: DataTables.Settings = {};

  constructor(private loader: LoadingService, private userService: UserService, private router: Router, private customerSerice: CustomerService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.dtOptions = {language: LanguageApp.dutch_datatables};
    this.loader.show();
      this.getUsers();
  }

  getUsers(){
    this.users$ = this.userService.getUsers().subscribe(result =>{
      this.users = result
      this.loader.hide()
    },
    error => {
      console.log(error);
    }
    );
  }

  addUser(){
    this.router.navigate(['superadmin/users/form'], {state: {mode: 'add'}})
  }

  editUser(idToEdit:number){
    this.router.navigate(['superadmin/users/form'], {state: {mode: 'edit', id: idToEdit}})
  }

  deleteUser(idToDelete:number, custIdToDelete:number){
    if(confirm("Bent u zeker dat u deze gebruiker wilt verwijderen?")){
      this.deleteCust$ = this.customerSerice.deleteCustomer(custIdToDelete).subscribe(result => {
        this.getUsers();
        this.showToasterDelete();
      });
    }
  }

  showToasterDelete(){
    this.toastrService.success("Gebruiker succesvol verwijderd");
  }
}
