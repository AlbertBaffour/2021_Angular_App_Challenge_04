import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/auth.service';

import { Customer } from "src/app/admin/customer";
import { Favorite } from './favorite';
import { FavoriteService } from './favorite.service';
import { User } from 'src/app/security/user';
import {LoadingService} from "../../shared/loading/loading.service";
import {Location} from "@angular/common";
import { CommunicationService } from 'src/app/shared/communication.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  favs$ : Subscription = new Subscription();
  favs : Favorite[] = [];
  currentUsr: User = {
    id: 0,
    email: '',
    password: '',
    isActive: false,
    isAdmin: false,
    isSuperAdmin: false,
    token: '',
    customerId: 0
  };
  loading$ = this.loader.loading$;


  constructor(private location: Location, private loader: LoadingService, private favService:FavoriteService, private authserv:AuthService) { }

  ngOnInit(): void {
    this.loader.show();
    this.Getcurruser()
    this.GetUserFavs()
  }

  goBack() {
    this.location.back();
  }

  Getcurruser(){
    let usr = this.authserv.getUser();
    if(usr != null){
      this.currentUsr = usr;
    }
  }

  GetUserFavs() {
    this.loader.show();

    this.favs = [];

    this.favs$ = this.favService.getFavs(this.currentUsr.customerId).subscribe(result =>{
      result.forEach(item => {
        if(item.customerId == this.currentUsr.customerId){
          this.favs.push(item);
        }
        this.loader.hide()
      })
    });
  }

}
