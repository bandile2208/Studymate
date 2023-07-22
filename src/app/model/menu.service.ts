import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private menuCtrl: MenuController) { }

  toggleMenu() {
    this.menuCtrl.enable(true, 'first');
    this.menuCtrl.open('first');
  }

  closeMenu(){
    this.menuCtrl.close();
  }



}