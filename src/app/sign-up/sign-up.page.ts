import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseError } from 'firebase/app';
import { User } from '../model/user.mode';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  user={} as User;
  constructor(private loadingController: LoadingController,
    private toast:ToastController,
    private navCtrl:NavController,
    private afAuth:AngularFireAuth,
    private firestore:AngularFirestore) { }

  ngOnInit() {
  }

  async register(user: User) {
    if (this.validation()) {
      const loader = await this.loadingController.create({
        message: 'Please wait',
      });
  
      await loader.present();
  
      try {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

       
        // Access the user's UID from the userCredential object
        if (userCredential && userCredential.user) {
          //Email verification
          await userCredential.user.sendEmailVerification();
          
          const uid = userCredential.user.uid;
  
        // Save additional user details to Firestore
        await this.firestore.collection('users').doc(uid).set({
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
        });

        

      }
       // this.navCtrl.navigateForward('login');
      } catch (e: unknown) {
        if (e instanceof FirebaseError){
          if (e.code === "auth/email-already-in-use") {
            this.showToast("Email Address Already In Use");
          }
        }
      }
  
      await loader.dismiss();
      this.showToast("Please verify your email. A link has been sent to your email address.");
      this.navCtrl.navigateRoot("login");
    }
  }

  validation()
  {
    if(!this.user.firstname)
    {
      this.showToast("Enter First Name");
      return false;
  
    }
    if(!this.user.lastname)
    {
      this.showToast("Enter Last Name");
      return false;
  
    }
    if(!this.user.email)
    {
      this.showToast("Enter email address");
      return false;
  
    }
    if(!this.user.password)
    {
      this.showToast("Enter password");
      return false;
  
    }
    if (this.user.password.length < 8) {
      this.showToast("Password should be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(this.user.password)) {
      this.showToast("Password should contain at least 1 uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(this.user.password)) {
      this.showToast("Password should contain at least 1 lowercase letter");
      return false;
    }
    if (!/\d/.test(this.user.password)) {
      this.showToast("Password should contain at least 1 numerical digit");
      return false;
    }
    if (this.user.password !== this.user.confirmPassword) {
      this.showToast("Password and confirm password do not match");
      return false;
    }
    return true;
  }
  showToast ( message : string ){
    this.toast.create ({
    message: message ,
   duration: 2000
   }). then ( toastData => toastData.present ());
  }

}

