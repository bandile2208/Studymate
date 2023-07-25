import { Component, OnInit } from '@angular/core';
import{User} from '../model/user.mode';
import { LoadingController, ToastController,NavController, ModalController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user ={ } as User;
  
  reset = '';

  constructor(private loadingController: LoadingController,
    private  toast:ToastController,
    private navCtrl:NavController,
    private afAuth:AngularFireAuth,
    private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  /*async forgotPassword() {
    if (!this.user.email) {
      this.showToast('Please enter your email');
      return;
    }
  
    const loader = await this.loadingController.create({
      message: 'Please wait',
    });
  
    await loader.present();
  
    try {
      await firebase.auth().sendPasswordResetEmail(this.user.email);
      this.showToast('Password reset email sent');
    } catch (e) {
      this.showToast(String(e));
    }
  
    await loader.dismiss();
  }*/
  

  async login(user:User)
  {
    if(this.validation())
    {
      let loader = this.loadingController.create({
        message: "please wait",
      });
    
      (await loader).present();
      /*try {
        await this.afAuth.signInWithEmailAndPassword(user.email,user.password)
        .then(data=>{console.log(data)});

        this.navCtrl.navigateRoot("notes");
        */
        try {
          const { user: firebaseUser } = await this.afAuth.signInWithEmailAndPassword(user.email, user.password);
          
          if (firebaseUser && firebaseUser.emailVerified){
              this.navCtrl.navigateRoot("dashboard");
            } else {
              await this.afAuth.signOut();
              this.showToast("Please verify your email before attempting to Sign-in.");
            }
          

      } catch (e: unknown) {
        if (e instanceof FirebaseError) {
          if (e.code === "auth/invalid-email" ) {
            this.showToast("Invalid email address.");
          } else if (e.code === "auth/user-disabled") {
            this.showToast("This email address is disabled. Please contact support.");
          } else if (e.code === "auth/user-not-found") {
            this.showToast("Email address not found. Please enter a valid email address or create a new account.");
          } 
           else if(e.code === "auth/wrong-password"){
          this.showToast("Invalid Password");
          }
          else {
            this.showToast("An error occurred. Please try again.");
          }
          
        } else {
          this.showToast("An unknown error occurred. Please try again.");
        }
      }
  
      await (await loader).dismiss();

    }

  }


  async forgotPassword() {
    if (!this.reset) {
      this.showToast('Please enter your email');
      return;
    }
  
    const loader = await this.loadingController.create({
      message: 'Please wait',
    });
  
    await loader.present();
  
    try {
      await this.afAuth.sendPasswordResetEmail(this.reset);
      this.showToast('Password reset email sent');
    } catch (e: unknown) {if (e instanceof FirebaseError) {
      if (e.code === "auth/invalid-email" ) {
        this.showToast("Invalid email address.");
      } else if (e.code === "auth/user-not-found") {
        this.showToast("Email address not found. Please enter a valid email address");
      } 
      else {
        this.showToast("An error occurred. Please try again.");
      }
      
    } else {
      this.showToast("An unknown error occurred. Please try again.");
    }
    }
  
    await loader.dismiss();
  }

  
  validation()
  {
    if(!this.user.email)
    {
      this.showToast("Enter username");
      return false;
  
    }
    if(!this.user.password)
    {
      this.showToast("Enter password");
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

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
