import { Component } from '@angular/core';
import { MenuService } from './model/menu.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFirestore} from '@angular/fire/compat/firestore'
import * as moment from 'moment';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

   firstName: string | undefined;
   lastName: string | undefined;
   notificationTime: string = '12:45';

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

   // this.scheduleNotification();
  } 



  scheduleNotification() {
    // Parse the notification time string to extract the hours and minutes
    const time = moment(this.notificationTime, 'HH:mm');
    const notificationHour = time.hours();
    const notificationMinute = time.minutes();

    // Get the current date and time
    const now = moment();
    const currentHour = now.hours();
    const currentMinute = now.minutes();

    // Calculate the time difference between now and the notification time
    let timeDiff = moment.duration({
      hours: notificationHour - currentHour,
      minutes: notificationMinute - currentMinute
    });

    // If the notification time has already passed for today, schedule it for the next day
    if (timeDiff.asMinutes() < 0) {
      timeDiff = moment.duration({
        hours: notificationHour + 24 - currentHour,
        minutes: notificationMinute - currentMinute
      });
    }

    // Calculate the total milliseconds until the notification should be triggered
    const timeDiffMilliseconds = timeDiff.asMilliseconds();

    // Use setInterval to schedule the notification
    setInterval(() => {
      this.sendNotification();
    }, timeDiffMilliseconds);
  }

  sendNotification() {
    // Replace this with code to trigger the notification on your phone
    // This could involve using a native plugin, a service worker, or a third-party library
    // For the sake of this example, we'll log a message to the console.
    console.log('Notification triggered!');
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
