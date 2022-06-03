import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  overlayClass: string = "nav-overlay";

  constructor() {
  }

  toggleNav(toggled: boolean){
    if (toggled){
      this.overlayClass = "nav-overlay height-100"
    }else{
      this.overlayClass = "nav-overlay"
    }
  }
}
