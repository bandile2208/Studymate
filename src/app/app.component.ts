import { Component } from '@angular/core';
import { MenuService } from './model/menu.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFirestore} from '@angular/fire/compat/firestore'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

   firstName: string | undefined;
   lastName: string | undefined;

  constructor(private menuService: MenuService,
    private route: Router,
    private  toast:ToastController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) {}

  ngOnInit(){
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userDocRef = this.firestore.collection('users').doc(user.uid);
        userDocRef.get().subscribe((doc) => {
          if (doc.exists) {
            const userData = doc.data() as {firstName: string, lastName: string};
            this.firstName = userData.firstName;
            this.lastName = userData.lastName;
          }
        });
      }
    });
  } 

  closeMenu() {
    this.menuService.closeMenu();
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.showToast("Signed Out");
      this.route.navigate(['/home']);
    });
  }

  showToast ( message : string ){
    this.toast.create ({
    message: message ,
   duration: 2000
   }). then ( toastData => toastData.present ());
  }

  
}
