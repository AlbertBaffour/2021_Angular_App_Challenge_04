import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  // Observable string sources
  private updateNavBasketSizeSource = new Subject<any>();

  // Observable string streams
  updateNavBasketSize$ = this.updateNavBasketSizeSource.asObservable();

  // Service message commands
  updateNavBasketSize() {
    this.updateNavBasketSizeSource.next();
  }
}
